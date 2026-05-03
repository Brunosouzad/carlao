import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { XMLParser } from "fast-xml-parser";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper: normaliza valor de campo para string limpa
function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

// Helper: normaliza número
function num(v: unknown): number {
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

// Mapeia um nó <Imovel> do VRSync para o schema do Supabase
function mapImovelToDb(imovel: Record<string, any>) {
  const tipoOferta = str(imovel.TipoOferta);
  const isVenda = tipoOferta.toLowerCase() === "venda";

  const precoRaw = isVenda
    ? imovel.PrecoVenda
    : imovel.PrecoLocacao || imovel.PrecoVenda;

  // Fotos
  let images: string[] = [];
  let coverImage = "";
  const fotosNode = imovel.Fotos;
  if (fotosNode) {
    const fotosArray = Array.isArray(fotosNode.Foto)
      ? fotosNode.Foto
      : fotosNode.Foto
      ? [fotosNode.Foto]
      : [];

    // Ordena por Ordem
    fotosArray.sort((a: any, b: any) => num(a.Ordem) - num(b.Ordem));

    images = fotosArray.map((f: any) => str(f.URLArquivo)).filter(Boolean);
    coverImage = images[0] || "";
  }

  // Características
  const featuresRaw = str(imovel.CaracteristicasImovel);
  const features = featuresRaw
    ? featuresRaw.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  // Endereço
  const bairro = str(imovel.Bairro);
  const cidade = str(imovel.Cidade);
  const logradouro = str(imovel.Logradouro);
  const numero = str(imovel.Numero);
  const complemento = str(imovel.Complemento);

  // Monta o campo location (exibição no site)
  const locationParts = [
    logradouro,
    numero ? `, ${numero}` : "",
    complemento ? ` - ${complemento}` : "",
    bairro ? ` - ${bairro}` : "",
    cidade ? `, ${cidade}` : "",
  ].join("").replace(/^[\s,\-]+/, "");

  return {
    code: str(imovel.CodigoImovel),
    title: str(imovel.Titulo),
    description: str(imovel.Descricao),
    type: isVenda ? "Venda" : "Aluguel",
    category: str(imovel.TipoImovel) || "Casa",
    price: String(num(precoRaw)),
    condominium: imovel.ValorCondominio ? String(num(imovel.ValorCondominio)) : null,
    iptu: imovel.ValorIPTU ? String(num(imovel.ValorIPTU)) : null,
    area: num(imovel.AreaUtil || imovel.AreaTotal),
    beds: num(imovel.QtdDormitorios),
    baths: num(imovel.QtdBanheiros),
    garages: num(imovel.QtdVagas),
    zip_code: str(imovel.CEP).replace(/\D/g, ""),
    street: logradouro,
    number: numero,
    complement: complemento,
    neighborhood: bairro,
    city: cidade,
    location: locationParts,
    image: coverImage,
    images: images.slice(1), // resto vai para galeria
    features,
    tag: str(imovel.Tag) || null,
    video_url: str(imovel.VideoURL) || null,
  };
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let xmlText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
      }
      xmlText = await file.text();
    } else {
      // Raw XML body or JSON with { xml: "..." }
      const body = await req.text();
      if (body.trimStart().startsWith("<")) {
        xmlText = body;
      } else {
        try {
          const json = JSON.parse(body);
          xmlText = json.xml || "";
        } catch {
          return NextResponse.json({ error: "Formato inválido. Envie XML diretamente ou multipart/form-data." }, { status: 400 });
        }
      }
    }

    if (!xmlText.trim()) {
      return NextResponse.json({ error: "XML vazio." }, { status: 400 });
    }

    // Parse do XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true,
      isArray: (name) => name === "Foto",
    });
    const parsed = parser.parse(xmlText);

    const root = parsed.Imoveis || parsed.imoveis;
    if (!root) {
      return NextResponse.json({ error: "XML inválido: elemento raiz <Imoveis> não encontrado." }, { status: 400 });
    }

    const imoveisRaw = root.Imovel || root.imovel || [];
    const imoveisArray: Record<string, any>[] = Array.isArray(imoveisRaw)
      ? imoveisRaw
      : [imoveisRaw];

    if (imoveisArray.length === 0) {
      return NextResponse.json({ error: "Nenhum imóvel encontrado no XML." }, { status: 400 });
    }

    let importados = 0;
    let atualizados = 0;
    const erros: string[] = [];

    for (const imovel of imoveisArray) {
      try {
        const dbData = mapImovelToDb(imovel);

        if (!dbData.code) {
          erros.push(`Imóvel sem CodigoImovel — ignorado.`);
          continue;
        }

        // Verifica se já existe
        const { data: existing } = await supabaseAdmin
          .from("properties")
          .select("id")
          .eq("code", dbData.code)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabaseAdmin
            .from("properties")
            .update(dbData)
            .eq("code", dbData.code);
          if (updateError) throw updateError;
          atualizados++;
        } else {
          const { error: insertError } = await supabaseAdmin
            .from("properties")
            .insert(dbData);
          if (insertError) throw insertError;
          importados++;
        }
      } catch (itemErr: any) {
        const code = str(imovel?.CodigoImovel) || "sem código";
        erros.push(`Código ${code}: ${itemErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      total: imoveisArray.length,
      importados,
      atualizados,
      erros,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Preview — retorna os imóveis parseados sem salvar (GET com body não é padrão, então usamos POST com ?preview=true)
export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let xmlText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
      xmlText = await file.text();
    } else {
      xmlText = await req.text();
    }

    if (!xmlText.trim()) {
      return NextResponse.json({ error: "XML vazio." }, { status: 400 });
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true,
      isArray: (name) => name === "Foto",
    });
    const parsed = parser.parse(xmlText);
    const root = parsed.Imoveis || parsed.imoveis;
    if (!root) {
      return NextResponse.json({ error: "XML inválido: <Imoveis> não encontrado." }, { status: 400 });
    }

    const imoveisRaw = root.Imovel || root.imovel || [];
    const imoveisArray = Array.isArray(imoveisRaw) ? imoveisRaw : [imoveisRaw];
    const preview = imoveisArray.map(mapImovelToDb);

    return NextResponse.json({ total: preview.length, imoveis: preview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
