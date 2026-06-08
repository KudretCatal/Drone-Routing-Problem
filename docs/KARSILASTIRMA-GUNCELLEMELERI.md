# Algoritma Karşılaştırma Özelliği — Güncelleme Notları

Bu doküman, projeye eklenen **"İki Algoritmayı Karşılaştır"** özelliğini ve bu süreçte yapılan tüm değişiklikleri özetler.

---

## 1. Tek Tuşla Eşzamanlı Karşılaştırma (Side-by-Side)

Daha önce kullanıcı yalnızca tek bir algoritmayı seçip çalıştırabiliyor, kıyaslamak için iki ayrı çalıştırma yapması gerekiyordu. Artık sidebar'da bulunan **"İki Algoritmayı Karşılaştır"** butonuna tek tıklamayla:

- Gurobi (Exact) ve Genetik Algoritma **aynı veri seti ve parametrelerle** arka planda eşzamanlı (concurrent thread'ler ile) çalıştırılır,
- Sonuçlar ekranda **iki ayrı harita üzerinde yan yana** (sol: Gurobi, sağ: Genetik Algoritma) görselleştirilir,
- Altında **Detaylı Karşılaştırma Raporu** otomatik oluşturulur:
  - Toplam operasyon süresi
  - Kamyon durağı (adım) sayısı
  - Toplam kamyon mesafesi
  - Teslim edilen paket sayısı
  - Quadrocopter / Octocopter görev dağılımı
  - Kazanan algoritma, fark (sn) ve iyileşme yüzdesi

**İlgili dosyalar:** `api/main.py` (`/api/compare` endpoint), `ui/index.html`, `ui/app.js`, `ui/styles.css`

---

## 2. Toplu / Ortalamalı Karşılaştırma Modu (N Defa Çalıştır ve Ortala)

Tek bir çalıştırmanın sonucu istatistiksel olarak yanıltıcı olabileceğinden (özellikle stokastik olan Genetik Algoritma için), kullanıcı artık karşılaştırma butonunun yanındaki sayı kutusuna bir **N değeri** girerek iki algoritmayı **N kez art arda** çalıştırabilir. Sistem:

- Her iki algoritmayı **N kez sırayla** çalıştırır (CPU ölçümlerinin birbirine karışmaması için ardışık),
- Ekranda bir **ilerleme modalı** gösterir: "Çalıştırma X / N" ve "Şu anda çalışıyor: Gurobi / Genetik Algoritma" bilgisini canlı olarak günceller (1.2 saniyede bir polling),
- Tüm çalıştırmalar bittiğinde, **gerçek ölçülmüş verilere dayalı** (hiçbir değer simüle/tahmin edilmemiş) bir özet rapor sunar:
  - Ortalama / En iyi (min) / En kötü (max) operasyon süresi
  - Operasyon süresi standart sapması
  - **Ortalama tüketilen CPU süresi** (`psutil` ile gerçek `user + system` CPU zamanı ölçümü)
  - Ortalama gerçek-zamanlı (wall-clock) çalışma süresi
  - Kazanılan çalıştırma sayısı (hangi algoritma kaç kez daha düşük/iyi operasyon süresi üretti)
  - Genel sonuç metni: kazanan algoritma, kaç çalıştırmada kazandığı, ortalama süre farkının yüzdesi ve CPU verimliliği farkı

> **Not — kaç deneme yeterli?** Genetik Algoritma stokastik olduğu için, "kesin" bir kıyas için istatistiksel olarak en az **30 bağımsız çalıştırma**, daha sağlam bir sonuç için **50-100 çalıştırma** önerilir. Gurobi tam (exact) bir çözücü olduğundan deterministiktir — aynı veri/parametrelerle her zaman birebir aynı sonucu üretir (bu yüzden raporlarda Gurobi'nin standart sapması her zaman `0.00` çıkar; bu bir hata değil, beklenen davranıştır).

**İlgili dosyalar:** `api/main.py` (`/api/compare-batch` ve `/api/compare-batch/status/{job_id}` endpoint'leri, arka plan thread'i ile iş takibi), `ui/index.html` (sayı girişi + ilerleme modalı), `ui/app.js`, `ui/styles.css`, `requirements.txt` (`psutil` eklendi)

---

## 3. Dil Desteği (Türkçe / İngilizce)

Hem tekli hem de toplu karşılaştırma raporlarındaki **tüm metinler** (tablo başlıkları, metrik adları, özet cümleleri, modal yazıları) Türkçe ve İngilizce çeviri setlerine eklendi. Dil değiştirildiğinde, o anda ekranda görünen rapor da otomatik olarak yeni dilde yeniden oluşturulur.

**İlgili dosyalar:** `ui/app.js` (`translations` nesnesi, `setLanguage` fonksiyonu)

---

## 4. Hata Düzeltmeleri

- **"İyileşme" satırındaki çelişkili ifade düzeltildi:** Eskiden rapor "Genetik Algoritma — 93.94 sn daha yavaş" gibi çelişkili bir metin üretebiliyordu (kazanan algoritmanın adı doğru seçiliyor ama "daha hızlı/daha yavaş" ifadesi yanlış hesaplanıyordu). Artık kazanan algoritma — tanımı gereği — her zaman "daha hızlı" olarak gösteriliyor; gereksiz `slower` çevirisi kaldırıldı.
- **Harita yakınlaştırma (zoom) sorunu giderildi:** Harita önceden yalnızca TSP rotasının sınırlarına göre ortalanıyordu; bu da bazı müşteri noktalarının ve kamyon rotası segmentlerinin kadraj dışında kalmasına yol açıyordu. Artık görünüm; depo, tüm müşteriler, TSP rotası ve kamyon rotasının **tamamını** kapsayacak şekilde daha geniş açılı (kuş bakışı) ayarlanıyor.

**İlgili dosyalar:** `ui/app.js`

---

## 5. Genetik Algoritma İyileştirmeleri

Genetik Algoritma'nın çözüm kalitesini artırmak amacıyla:

- **Popülasyon büyüklüğü:** 150 → **250**
- **Nesil (generation) sayısı:** 400 → **800**

Bu artışın performansı olumsuz etkilememesi için algoritma da verimli hale getirildi:

- **Mesafe matrisi önbelleğe alındı:** Tekrar tekrar `math.dist` çağırmak yerine tüm ikili mesafeler bir kez hesaplanıp tabloya yazılıyor (O(1) erişim).
- **Fitness (uygunluk) skorları nesil başına bir kez hesaplanıyor:** Eskiden her aday için turnuva seçiminde tekrar tekrar (6 kereye kadar) yeniden hesaplanan mesafe değerleri artık önbelleğe alınıp yeniden kullanılıyor.
- **Çaprazlamada `set` tabanlı üyelik kontrolü:** Liste taraması yerine O(1) küme kontrolü kullanılarak yavru birey oluşturma hızlandırıldı.

**İlgili dosya:** `core_engine/geneticalgosolution.py`

---

## 6. Veri Seti Güncellemesi

`data/veri_seti.txt` dosyasındaki müşteri sayısı artırıldı (orijinal 25 müşteriden daha büyük bir veri setine geçildi). 

> ⚠️ **Önemli not — Gurobi lisans sınırı:** Müşteri sayısı arttıkça Gurobi'nin TSP için kurduğu MIP modelindeki değişken sayısı **karesel (~n²)** olarak büyür. Sınırlı/ücretsiz Gurobi lisansları belirli bir model boyutunu aşan problemlerde `Model too large for size-limited license` hatası verir. Büyük veri setleriyle çalışırken ya veri setini küçük tutmanız, ya da tam/ticari bir Gurobi lisansı edinmeniz gerekir. Genetik Algoritma bu sınırlamadan etkilenmez (Gurobi'ye bağımlı değildir).

