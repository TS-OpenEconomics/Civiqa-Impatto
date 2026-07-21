import { useNavigate } from "react-router-dom";

// Mappa id progetto nido → alternativa DOCFAP. Se l'id non è un nido, il banner
// non viene mostrato (ritorna null): le pagine restano invariate per gli altri progetti.
const NIDO_ALT = {
  "PROJ-NIDO-A1": { alt: "A1", label: "Nuova costruzione" },
  "PROJ-NIDO-A2": { alt: "A2", label: "Ristrutturazione" },
  "PROJ-NIDO-A3": { alt: "A3", label: "Voucher alle famiglie" },
};

export function NidoBridgeBanner({ projectId }) {
  const navigate = useNavigate();
  const info = projectId ? NIDO_ALT[projectId] : null;
  if (!info) return null;
  return (
    <div style={wrap}>
      <div style={left}>
        <span style={chip}>{info.alt}</span>
        <span style={text}>
          Alternativa <b>{info.label}</b> · dal DOCFAP «Asilo nido comunale»
        </span>
      </div>
      <button type="button" style={btn} onClick={() => navigate("/impatti/docfap/detail")}>
        ← Torna al DOCFAP
      </button>
    </div>
  );
}

const wrap = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", margin: "0 0 16px", padding: "12px 20px", background: "linear-gradient(95deg,#F3EEFE,#fbf8ff 70%,#fff)", border: "1px solid #E5E5E8", borderRadius: "8px" };
const left = { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 };
const chip = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "24px", padding: "0 8px", background: "#5B21F7", color: "#fff", fontWeight: 800, fontSize: "12px", fontFamily: "monospace" };
const text = { fontSize: "13.5px", color: "#0E0E10" };
const btn = { border: "1px solid #5B21F7", background: "#fff", color: "#5B21F7", fontWeight: 700, fontSize: "13px", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" };
