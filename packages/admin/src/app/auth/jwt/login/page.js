import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Admin: Iniciar sesión',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
