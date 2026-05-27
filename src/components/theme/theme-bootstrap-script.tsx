import { getThemeBootstrapScript } from "@/lib/theme/theme";

export function ThemeBootstrapScript() {
  return <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />;
}
