"use client";
import { useEffect, useState } from "react";
import { divisions, type Division } from "@/lib/content";
type Lead = {
  id: string;
  division: Division;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  consent: number;
  consent_text: string;
  created_at: string;
  suppressed: boolean;
  details: Record<string, string>;
};
type Activity = {
  id: string;
  lead_id: string;
  actor: string;
  action: string;
  created_at: string;
};
type Appointment = {
  id: string;
  lead_id: string;
  starts_at: string;
  notes: string;
};
type Data = {
  role: string;
  leads: Lead[];
  activities: Activity[];
  appointments: Appointment[];
};
export default function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [division, setDivision] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState("");
  async function load() {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) setData(await res.json());
      else if (res.status === 401) setData(null);
      else setError("Unable to load CRM.");
    } catch {
      setError("Unable to connect.");
    } finally {
      setReady(true);
    }
  }
  useEffect(() => {
    let active = true;
    fetch("/api/admin/leads")
      .then(async (res) => {
        if (!active) return;
        if (res.ok) {
          const payload = await res.json();
          if (active) setData(payload);
        } else if (res.status !== 401) setError("Unable to load CRM.");
      })
      .catch(() => {
        if (active) setError("Unable to connect.");
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  async function mutate(url: string, method: string, payload: unknown) {
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error);
        return false;
      }
      await load();
      return true;
    } catch {
      setError("Unable to save changes.");
      return false;
    }
  }
  const lead = data?.leads.find((l) => l.id === selected);
  return (
    <section className="section dashboard">
      <p className="eyebrow red">DK GROUP · INTERNAL WORKSPACE</p>
      <div className="dashboard-title">
        <h1>Acquisition desk.</h1>
        {data && (
          <button
            className="text-link"
            onClick={async () => {
              await mutate("/api/admin/logout", "POST", {});
              setData(null);
            }}
          >
            Sign out ↗
          </button>
        )}
      </div>
      <p>
        Human relationships. Clear next steps.{" "}
        <span className="badge">Outbound AI calling disabled</span>
      </p>
      {error && (
        <p role="alert" className="form-result">
          {error}
        </p>
      )}
      {!ready ? (
        <p>Loading secure workspace…</p>
      ) : !data ? (
        <div className="login-box">
          <h2>Team sign in</h2>
          <p>
            Access requires server-configured credentials. No default accounts
            are provided.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              await mutate("/api/admin/login", "POST", {
                role: form.get("role"),
                password: form.get("password"),
              });
            }}
          >
            <label>
              Role
              <select name="role">
                <option value="admin">Administrator</option>
                <option value="staff">Staff</option>
                <option value="viewer">Read-only viewer</option>
              </select>
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                maxLength={200}
              />
            </label>
            <button className="button">Sign in securely ↗</button>
          </form>
        </div>
      ) : (
        <>
          <div className="stats">
            <div>
              <span>Total inquiries</span>
              <strong>{data.leads.length}</strong>
            </div>
            <div>
              <span>New inquiries</span>
              <strong>
                {data.leads.filter((l) => l.status === "new").length}
              </strong>
            </div>
            <div>
              <span>Appointments</span>
              <strong>{data.appointments.length}</strong>
            </div>
            <div>
              <span>Your access</span>
              <strong className="role">{data.role}</strong>
            </div>
          </div>
          <div className="filters">
            <label>
              Division
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
              >
                <option value="all">All divisions</option>
                {Object.entries(divisions).map(([key, d]) => (
                  <option value={key} key={key}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["all", "new", "contacted", "qualified", "closed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button className="text-link" onClick={load}>
              Refresh ↻
            </button>
          </div>
          <div className="table-scroll">
            <table>
              <caption>
                Latest 500 inquiries · select a name to view details
              </caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Division</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {data.leads
                  .filter(
                    (l) =>
                      (division === "all" || l.division === division) &&
                      (status === "all" || l.status === status),
                  )
                  .map((l) => (
                    <tr key={l.id}>
                      <td>
                        <button
                          className="text-link"
                          onClick={() => setSelected(l.id)}
                        >
                          {l.name} ↗
                        </button>
                      </td>
                      <td>{divisions[l.division].name}</td>
                      <td>{l.status}</td>
                      <td>
                        {l.suppressed ? (
                          <span className="badge">Marketing suppressed</span>
                        ) : (
                          l.phone
                        )}
                      </td>
                      <td>{new Date(l.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!data.leads.length && (
              <p>No inquiries yet. New website submissions will appear here.</p>
            )}
          </div>
          {lead && (
            <section className="lead-detail">
              <div className="dashboard-title">
                <h2>{lead.name}</h2>
                <button onClick={() => setSelected("")}>Close details ×</button>
              </div>
              <p>{lead.address}</p>
              <p>
                {lead.email} · {lead.phone}
              </p>
              <p>
                {lead.suppressed
                  ? "Marketing suppressed. Do not initiate marketing contact."
                  : "Human inquiry response only; verify contact permissions."}
              </p>
              <dl>
                {Object.entries(lead.details)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
              <details>
                <summary>Contact permission evidence</summary>
                <p>
                  Optional permission:{" "}
                  {lead.consent ? "Checked" : "Not checked"}
                </p>
                <p>{lead.consent_text}</p>
                <p>
                  Recorded {lead.created_at}. This is not automated voice
                  consent.
                </p>
              </details>
              <label>
                Lead status
                <select
                  value={lead.status}
                  disabled={data.role === "viewer"}
                  onChange={(e) =>
                    mutate("/api/admin/leads", "PATCH", {
                      id: lead.id,
                      status: e.target.value,
                    })
                  }
                >
                  {["new", "contacted", "qualified", "closed"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <h3>Appointments</h3>
              <p>
                Internal scheduling only. Confirm directly with the customer; no
                calendar invitations are sent.
              </p>
              {data.appointments
                .filter((a) => a.lead_id === lead.id)
                .map((a) => (
                  <p key={a.id}>
                    {new Date(a.starts_at).toLocaleString()} — {a.notes}
                  </p>
                ))}
              {data.role !== "viewer" && (
                <form
                  className="appointment-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const f = new FormData(form);
                    if (
                      await mutate("/api/admin/appointments", "POST", {
                        leadId: lead.id,
                        startsAt: new Date(
                          f.get("time") as string,
                        ).toISOString(),
                        notes: f.get("notes"),
                      })
                    )
                      form.reset();
                  }}
                >
                  <label>
                    Time (your local time zone)
                    <input type="datetime-local" name="time" required />
                  </label>
                  <label>
                    Internal notes
                    <input name="notes" maxLength={500} />
                  </label>
                  <button className="button">Record appointment ↗</button>
                </form>
              )}
              <h3>Activity log</h3>
              {data.activities
                .filter((a) => a.lead_id === lead.id)
                .map((a) => (
                  <p key={a.id}>
                    <small>
                      {new Date(a.created_at).toLocaleString()} · {a.actor}
                    </small>
                    <br />
                    {a.action}
                  </p>
                ))}
            </section>
          )}
        </>
      )}
    </section>
  );
}
