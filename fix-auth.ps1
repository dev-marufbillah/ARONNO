$files = @(
  "src\app\api\wishlist\route.ts",
  "src\app\api\admin\categories\route.ts",
  "src\app\api\admin\orders\[id]\route.ts",
  "src\app\api\admin\products\route.ts",
  "src\app\api\admin\products\[id]\route.ts",
  "src\app\api\orders\route.ts"
)

foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file -Raw
  $content = $content -replace 'import \{ getServerSession \} from "next-auth";\r?\n?', ''
  $content = $content -replace 'import \{ authOptions \} from "@/auth";', 'import { auth } from "@/auth";'
  $content = $content -replace 'const session = await getServerSession\(authOptions\);', 'const session = await auth();'
  Set-Content -LiteralPath $file -Value $content -NoNewline
  Write-Host "✅ Fixed: $file"
}

Write-Host "`n🎉 All 6 files updated to NextAuth v5!"