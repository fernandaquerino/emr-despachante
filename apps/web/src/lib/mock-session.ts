/**
 * Sessão mockada para a casca autenticada (issue "casca autenticada e
 * navegação"). Não existe autenticação real neste repositório ainda — o
 * fluxo real é login único → backend resolve memberships → redireciona
 * para /owner, /partner ou /admin (docs/EMR-SCREEN-MAP.md §1/§21).
 *
 * "Menu/sidebar é UX; autorização verdadeira fica no backend" — este mock
 * não faz nenhum enforcement de acesso, só popula o shell visualmente.
 *
 * TODO(auth): substituir por resolução real de sessão quando o backend
 * expuser um endpoint de perfil (ex.: /me) e a autenticação estiver
 * implementada. Nenhum código fora desta pasta deve depender deste mock
 * permanecer — ele existe só para o AppShell ter o que renderizar.
 */
export type MockContext = "owner" | "partner" | "admin";
export type MockRole = "OWNER" | "PARTNER" | "PARTNER_ADMIN" | "ADMIN";

export interface MockSession {
  name: string;
  email: string;
  role: MockRole;
  avatarSrc?: string;
}

const MOCK_SESSIONS: Record<MockContext, MockSession> = {
  owner: { name: "Fernanda Querino", email: "fernanda@example.com", role: "OWNER" },
  partner: { name: "Carlos Andrade", email: "carlos@parceiro.example.com", role: "PARTNER_ADMIN" },
  admin: { name: "Beatriz Lima", email: "beatriz@emr.example.com", role: "ADMIN" },
};

export function getMockSession(context: MockContext): MockSession {
  return MOCK_SESSIONS[context];
}
