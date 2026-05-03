import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function escapeXml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildPropertyXml(p: Record<string, any>): string {
  const isVenda = p.type === "Venda";
  const precoVenda = isVenda ? Number(p.price || 0).toFixed(2) : "";
  const precoLocacao = !isVenda ? Number(p.price || 0).toFixed(2) : "";

  const allImages: string[] = [];
  if (p.image) allImages.push(p.image);
  if (Array.isArray(p.images)) {
    p.images.forEach((img: string) => {
      if (img && img !== p.image) allImages.push(img);
    });
  }

  const fotosXml = allImages
    .map(
      (url, i) => `      <Foto>
        <URLArquivo>${escapeXml(url)}</URLArquivo>
        <Destaque>${i === 0 ? "1" : "0"}</Destaque>
        <Ordem>${i + 1}</Ordem>
      </Foto>`
    )
    .join("\n");

  const features = Array.isArray(p.features) ? p.features.join(",") : "";

  return `  <Imovel>
    <CodigoImovel>${escapeXml(p.code)}</CodigoImovel>
    <TipoImovel>${escapeXml(p.category)}</TipoImovel>
    <SubTipoImovel>${escapeXml(p.category)} Padrão</SubTipoImovel>
    <TipoOferta>${escapeXml(p.type)}</TipoOferta>
    <Titulo>${escapeXml(p.title)}</Titulo>
    <Descricao>${escapeXml(p.description)}</Descricao>
    <PrecoVenda>${precoVenda}</PrecoVenda>
    <PrecoLocacao>${precoLocacao}</PrecoLocacao>
    <ValorCondominio>${p.condominium ? Number(p.condominium).toFixed(2) : ""}</ValorCondominio>
    <ValorIPTU>${p.iptu ? Number(p.iptu).toFixed(2) : ""}</ValorIPTU>
    <AreaTotal>${p.area || 0}</AreaTotal>
    <AreaUtil>${p.area || 0}</AreaUtil>
    <QtdDormitorios>${p.beds || 0}</QtdDormitorios>
    <QtdBanheiros>${p.baths || 0}</QtdBanheiros>
    <QtdVagas>${p.garages || 0}</QtdVagas>
    <CEP>${escapeXml(p.zip_code || p.zipCode)}</CEP>
    <Logradouro>${escapeXml(p.street)}</Logradouro>
    <Numero>${escapeXml(p.number)}</Numero>
    <Complemento>${escapeXml(p.complement)}</Complemento>
    <Bairro>${escapeXml(p.neighborhood)}</Bairro>
    <Cidade>${escapeXml(p.city)}</Cidade>
    <UF>MG</UF>
    <Fotos>
${fotosXml}
    </Fotos>
    <CaracteristicasImovel>${escapeXml(features)}</CaracteristicasImovel>
    <Tag>${escapeXml(p.tag)}</Tag>
    <VideoURL>${escapeXml(p.video_url || p.videoUrl)}</VideoURL>
  </Imovel>`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo"); // "Venda" | "Aluguel" | null

    let query = supabaseAdmin.from("properties").select("*").order("created_at", { ascending: false });
    if (tipo === "Venda" || tipo === "Aluguel") {
      query = query.eq("type", tipo);
    }

    const { data: properties, error } = await query;
    if (error) throw error;

    const imovelNodes = (properties || []).map(buildPropertyXml).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Feed VRSync gerado por Carlão Imóveis — ${new Date().toISOString()} -->
<Imoveis>
${imovelNodes}
</Imoveis>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="imoveis-carlao-${Date.now()}.xml"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
