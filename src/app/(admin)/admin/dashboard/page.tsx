import { Post } from "@/lib/types";

const mockStats = [
  { title: "Toplam İçerik", value: "128", change: "+12%", isPositive: true },
  { title: "Aylık Okunma", value: "45.2K", change: "+8%", isPositive: true },
  { title: "Taslaklar", value: "6", change: "-2", isPositive: false },
];

const recentPosts: Post[] = [
  { id: "1", title: "Next.js 16 ile Gelen Yenilikler", slug: "nextjs-16-yeni", category: "Yazılım", status: "published", views: 1240, updatedAt: "2026-08-07" },
  { id: "2", title: "Tailwind CSS Best Practices", slug: "tailwind-best-practices", category: "Tasarım", status: "draft", views: 0, updatedAt: "2026-08-06" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Genel Bakış</h1>

      {/* Metrik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockStats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className={`text-sm font-semibold ${stat.isPositive ? "text-emerald-600" : "text-amber-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Son Eklenen İçerikler Tablosu */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Son İçerikler</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                <th className="pb-3 font-medium">Başlık</th>
                <th className="pb-3 font-medium">Kategori</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{post.title}</td>
                  <td className="py-3 text-slate-500">{post.category}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      post.status === "published" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{post.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
