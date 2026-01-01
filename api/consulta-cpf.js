export default async function handler(req, res) {
  const cpf = String(req.query.cpf || "").replace(/\D/g, "");
  if (!cpf || cpf.length !== 11) {
    return res.status(422).json({ valid: false, message: "CPF inválido." });
  }

  // ✅ coloque seu token em ENV: CPF_API1_TOKEN
  const token = process.env.CPF_API1_TOKEN;

  let dadosTratados = null;

  // 1) API 1
  try {
    const apiUrl = `https://centralajudabrasil.online/api/${token}/cpf/${cpf}`;
    const response = await fetch(apiUrl, { method: "GET" });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === "object" && data.NOME) {
        dadosTratados = {
          cpf,
          nome: data.NOME || "",
          nascimento: data.NASC || "",
          sexo: data.SEXO || "",
          nome_mae: data.NOME_MAE || ""
        };
      }
    }
  } catch (e) {}

  // 2) API 2 (fallback)
  if (!dadosTratados) {
    try {
      const apiUrl2 = `https://loteriasbilhetesonline.it.com/api/cpf/consulta/${cpf}`;
      const response2 = await fetch(apiUrl2, { method: "GET" });

      if (response2.ok) {
        const data2 = await response2.json();
        if (data2 && data2.success && data2.data) {
          const d = data2.data;
          dadosTratados = {
            cpf: d.cpf || cpf,
            nome: d.nome || d.nome_completo || "",
            nascimento: d.data_nascimento || "",
            sexo: "",
            nome_mae: ""
          };
        }
      }
    } catch (e) {}
  }

  if (!dadosTratados) {
    return res.status(422).json({ valid: false, message: "CPF inválido ou não encontrado." });
  }

  return res.status(200).json({ valid: true, data: dadosTratados });
}
