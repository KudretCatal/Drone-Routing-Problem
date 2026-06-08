# Bu Proje Tam Olarak Ne Yapıyor ve Nasıl Çalışıyor?

Bu doküman, projeyi hiç bilmeyen birine de, kodu okuyacak birine de hitap edecek şekilde **baştan sona** anlatmak için yazıldı. Önce "olayın özeti" var (mühendis olmayan biri için), sonra her bir parçanın teknik detayına iniyoruz.

---

## 1. Bu Proje Ne Sorununu Çözüyor? (Sade Anlatım)

Hayal edin: Bir kargo şirketinin elinde **bir tane kamyon** ve kamyonun üstünde taşınan **birkaç tane drone (insansız hava aracı)** var. Şehrin farklı yerlerinde teslim edilmesi gereken paketler var. Amaç:

> Kamyon + drone ekibinin, **tüm paketleri en kısa sürede** ve **drone'ların bataryası bitmeden** teslim etmesini sağlayacak en iyi planı bulmak.

Bunun püf noktası şu: Drone'lar paketleri kamyondan alıp uçarak müşteriye götürüyor, sonra ya kamyona geri dönüyor ya da kamyonun bir sonraki durağında onu karşılıyor. Yani kamyon ile drone'lar **eşzamanlı ve koordineli** çalışıyor — kamyon dururken drone'lar etrafa "saçılıp" teslimat yapıyor, sonra hep birlikte bir sonraki durağa geçiliyor.

Bu, akademik literatürde **k-MVDRP (k-Multi-Visit Drone Routing Problem)** olarak bilinen, oldukça karmaşık bir optimizasyon problemidir. "k" harfi, ekipte kaç tane drone olduğunu ifade eder.

Bu proje, bu problemi **iki farklı yöntemle** çözebilen ve sonuçları görsel olarak (haritada) gösteren bir web uygulamasıdır. Ayrıca bu iki yöntemi birbiriyle **kıyaslayan** bir özelliği de vardır — "hangisi daha iyi?" sorusuna gerçek verilerle cevap arar.

### Neden iki yöntem var?

Bu tarz problemler matematiksel olarak çok zordur (teknik adıyla "NP-Zor"). Onları çözmek için iki temel felsefe vardır:

1. **Kesin/Tam Çözüm (Gurobi):** "Ben bütün olasılıkları matematiksel olarak inceleyip **kesinlikle en iyi** olanı bulurum." Ama bu yöntem, problem büyüdükçe (müşteri sayısı arttıkça) inanılmaz yavaşlar — saatler, hatta günler sürebilir.
2. **Akıllı Tahmin / Sezgisel Çözüm (Genetik Algoritma):** "Ben mükemmeli garanti edemem ama doğanın evrim mekanizmasını taklit ederek, makul bir sürede **çok iyiye yakın** bir çözüm bulurum." Bu çok daha hızlıdır ama "en iyi" olduğunu garanti etmez.

İşte bu proje tam olarak bu iki felsefeyi **aynı problem üzerinde, yan yana** test edip karşılaştırmamızı sağlıyor.

---

## 2. Sistemin Genel Mimarisi (Parçalar Nasıl Bir Araya Geliyor?)

Proje üç ana katmandan oluşur:

```
┌──────────────────────┐      HTTP istekleri       ┌───────────────────────┐
│   ui/  (Arayüz)      │ ───────────────────────▶ │   api/main.py          │
│  index.html, app.js, │                           │   (FastAPI sunucusu)   │
│  styles.css          │ ◀─────────────────────── │                        │
│  Tarayıcıda çalışır  │      JSON sonuçlar        └──────────┬────────────┘
└──────────────────────┘                                      │
                                                               │ Python fonksiyon çağrısı
                                                               ▼
                                                   ┌───────────────────────────┐
                                                   │ core_engine/               │
                                                   │  - gurobisolution.py       │
                                                   │  - geneticalgosolution.py  │
                                                   │  (Asıl optimizasyon motoru)│
                                                   └───────────────────────────┘
                                                               │
                                                               ▼
                                                   data/veri_seti.txt (müşteri/koordinat verisi)
```

- **`ui/` (Arayüz katmanı):** Kullanıcının tarayıcıda gördüğü her şey. Saf HTML/CSS/JavaScript ile yazılmış (React, Vue gibi bir kütüphaneye ihtiyaç duymadan). Haritalar **Leaflet.js** kütüphanesiyle çiziliyor.
- **`api/main.py` (Sunucu/köprü katmanı):** **FastAPI** ile yazılmış bir REST API sunucusu. Arayüzden gelen "şunu hesapla" isteklerini alır, doğru optimizasyon motorunu çalıştırır, sonucu JSON formatında arayüze geri yollar.
- **`core_engine/` (Beyin/motor katmanı):** Asıl matematiksel/algoritmik işin yapıldığı yer. İki ayrı çözücü dosyası var: biri Gurobi tabanlı, diğeri Genetik Algoritma tabanlı. Her ikisi de aynı veri formatını okur ve aynı şekilde sonuç üretir — böylece adil bir kıyas mümkün olur.
- **`data/veri_seti.txt`:** Depo konumu, müşteri konumları (X-Y koordinatları) ve her müşterinin paket ağırlığını içeren metin dosyası (Solomon VRPTW formatına benzer bir yapıda).

**Mala anlatımı:** Arayüz bir "kumanda paneli" gibidir — düğmelere basarsınız. Bu düğmeler arka planda sunucuya "şu ayarlarla hesapla" diye bir mesaj gönderir. Sunucu da bu mesajı alıp gerçek hesaplamayı yapan "motor"a iletir, motor cevabı üretince sunucu bunu arayüze geri taşır ve siz haritada sonucu görürsünüz.

---

## 3. Çözüm Süreci: Üç Aşamalı (Phase) Yapı

İşin can alıcı noktası şudur: **Hem Gurobi hem Genetik Algoritma, problemi aynı üç aşamalı süreçle çözer.** Aralarındaki tek fark, **birinci aşamayı** nasıl çözdükleridir. İkinci ve üçüncü aşamalar tamamen ortak/aynıdır — bu da kıyasın adil olmasını sağlayan en önemli tasarım kararıdır.

### Faz 1 — "Hangi sırayla ziyaret edelim?" (TSP — Gezgin Satıcı Problemi)

Önce, drone'ların paketleri **hangi sırada** teslim edeceğine karar verilir. Bu, klasik "Gezgin Satıcı Problemi" (TSP) adı verilen ünlü bir problemdir: "N tane şehri en kısa toplam mesafeyle gezmek için hangi sırayla gitmeliyim?"

- **Gurobi yönteminde** bu, bir Karma Tamsayılı Programlama (MIP) modeli olarak kurulur ve Gurobi motoru tarafından **matematiksel olarak kesin** çözülür (`gurobisolution.py` → `solve_tsp_gurobi`).
- **Genetik Algoritma yönteminde** ise bu sıralama, evrimsel bir süreçle (aşağıda detaylandırılacak) **tahmin edilir** (`geneticalgosolution.py` → `solve_tsp_ga`).

Çıktı, her iki yöntemde de aynıdır: `[0, 5, 2, 8, 1, ...]` gibi, depo (0 numaralı nokta) ile başlayıp müşterileri hangi sırayla ziyaret edeceğimizi gösteren bir liste — buna **"visit_order" (ziyaret sırası)** denir.

> Bu liste henüz "kamyon nereye gidecek, hangi drone hangi paketi taşıyacak" sorularını cevaplamaz — sadece "genel teslimat sırası" mantığını belirler. Asıl iş bundan sonra başlar.

### Faz 2 — "Bu sırayı kamyon + drone ekibine nasıl bölüştürürüz?" (Blok Atama ve Enerji Kontrolü)

Bu, projenin en karmaşık ve en özgün kısmıdır — `run_rts_algorithm` fonksiyonunda (her iki dosyada da birebir aynı kopya halinde) yer alır.

Mantık şöyle işler:

1. Ziyaret sırasındaki müşteriler, küçük **bloklara** bölünür (örneğin "1, 2, 3, 4, 5, 6 numaralı müşteriler bir blok").
2. Bir blok içindeki müşteriler, eldeki **k tane drone'a** sırayla paylaştırılır (örneğin 6 müşteri, 2 drone varsa: Drone 1 → 1,2,3 numaralı müşteriler; Drone 2 → 4,5,6 numaralı müşteriler).
3. Her drone için şunlar hesaplanır:
   - **Hangi drone tipi kullanılmalı?** Eğer taşınacak toplam ağırlık 3 kg'dan azsa **Quadrocopter** (küçük/çevik drone), fazlaysa **Octocopter** (büyük/güçlü drone) seçilir.
   - **Ne kadar enerji harcanacak?** Burada gerçekçi bir fizik modeli kullanılıyor: drone'un enerji tüketimi, **taşıdığı ağırlığa göre değişen bir oran** ile hesaplanıyor (`get_energy_rate` fonksiyonu — akademik bir makalenin Ek-A bölümündeki ampirik tablo değerlerine dayanıyor). Drone paket teslim ettikçe hafifler, dolayısıyla enerji tüketim hızı da yolculuk boyunca değişir; kod bunu adım adım simüle eder.
   - **Süre olarak bu iş ne kadar sürer?** Drone'un uçuş mesafesi / hızı = uçuş süresi. Eğer drone, kamyonun bir sonraki durağa varmasından önce işini bitirirse, kamyonu beklerken bile (havada asılı kalarak — "hover") enerji tüketmeye devam eder; bu da hesaba katılır.
4. **Fizibilite kontrolü:** Eğer bir drone'un toplam enerji tüketimi, kullanıcının arayüzden girdiği **batarya limitini (EMAX)** aşarsa, bu blok ataması **"yapılamaz" (infeasible)** olarak işaretlenir ve o seçenek elenir.
5. Bu hesaplamaların hepsi bir **graf (yönlü çizge - "directed graph")** üzerinde "kenar" (edge) olarak temsil edilir: Düğümler `(konum, kaçıncı_müşteriye_kadar_teslim_edildi)` şeklinde, kenarlar ise "buradan oraya, şu sürede, şu drone görev dağılımıyla gidilebilir" bilgisini taşır.

**Mala anlatımı:** Bu aşama, "Tamam, ziyaret sırasını biliyoruz ama kamyon nerede duracak, her durakta hangi drone hangi paketleri alıp götürecek, bataryaları yetecek mi?" sorularının cevabını arıyor. Mümkün olan **her türlü bölüştürme kombinasyonunu** bir harita (graf) üzerinde "bu mümkün, şu kadar sürer" şeklinde işaretliyor.

### Faz 3 — "En kısa toplam süreyi veren yolu seçelim" (En Kısa Yol / Shortest Path)

Faz 2'de oluşturulan devasa graf üzerinde, **NetworkX** kütüphanesinin `shortest_path` fonksiyonu kullanılarak depodan (başlangıç) tekrar depoya (tüm teslimatlar tamamlanmış hal) giden **en düşük toplam süreli yol** bulunur.

Bu yolun toplam süresi → **`total_time`** değeridir. Bu, sistemin nihai "operasyon kalitesi" ölçütüdür: *"Bu plan uygulanırsa, tüm teslimatlar kaç saniyede/saatte biter?"*

> ⚠️ **Önemli ayrım:** `total_time`, **algoritmanın çalışmasının ne kadar sürdüğü** (yani bilgisayarın hesaplama süresi) DEĞİLDİR. Bu, **bulunan çözümün ne kadar iyi olduğunun** ölçüsüdür — yani "gerçek hayatta bu plan uygulansa, operasyon kaç saniyede tamamlanır" sorusunun cevabıdır. Algoritmanın kendi çalışma/hesaplama süresi ayrı bir kavramdır (bkz. Bölüm 6 — Karşılaştırma Özelliği, "CPU süresi" ve "wall-clock süresi").

Sonuçta arayüze şu bilgiler dönülür: toplam süre, kamyonun adım adım nereye gidip ne yaptığı (`steps`), her durakta hangi drone'un hangi paketleri taşıdığı, kamyonun fiziksel rotası (haritada çizilecek koordinatlar) vs.

---

## 4. Birinci Yöntem: Gurobi (Kesin/Tam Çözüm)

**Dosya:** `core_engine/gurobisolution.py`

[Gurobi](https://www.gurobi.com/), dünyanın önde gelen **matematiksel optimizasyon motorlarından** biridir — büyük şirketler, havayolları, lojistik firmaları tarafından gerçek operasyonel problemler için kullanılır.

### Nasıl çalışır? (Faz 1'de)

Kod, TSP problemini bir **Karma Tamsayılı Programlama (Mixed-Integer Programming - MIP)** modeli olarak kurar:

- Her "şehirden şehre gidiş" ihtimali için bir 0/1 (evet/hayır) değişkeni tanımlanır: `x[i,j]` = "i'den j'ye doğrudan gidildi mi?"
- Amaç fonksiyonu: toplam yolculuk süresini (mesafe / hız) en aza indirmek.
- Kısıtlar: her noktaya tam olarak bir kez girilir, bir kez çıkılır, bir nokta kendine gitmez, ve **alt-tur (subtour) önleme kısıtları** eklenir (bu olmadan model "10-11-10" gibi anlamsız küçük döngüler üretebilir).
- `model.optimize()` çağrıldığında Gurobi, "Dal-Sınır" (Branch & Bound) gibi gelişmiş matematiksel teknikler kullanarak **kesin olarak en iyi** çözümü bulana kadar arama yapar.

**Mala anlatımı:** Gurobi, milyonlarca olası rota kombinasyonunu akıllıca eleyerek (hepsini tek tek denemeden, matematiksel mantık yürüterek) "işte bu, kesinlikle en kısa rota" diyebilen bir uzman gibidir. Garantisi var ama bu garantiyi vermek için bazen çok zaman harcar.

### Avantajı ve dezavantajı

- ✅ **Avantaj:** Bulduğu sonuç **kesinlikle en iyisidir** (matematiksel ispatla). Aynı veriyle her çalıştırıldığında **birebir aynı sonucu** verir (deterministiktir — şans faktörü yoktur).
- ❌ **Dezavantaj:** Müşteri sayısı arttıkça model büyür (yaklaşık `müşteri_sayısı²` oranında değişken sayısı artar) ve çözüm süresi katlanarak uzar. Ayrıca ücretsiz/sınırlı Gurobi lisansları belirli bir model boyutunun üzerinde `"Model too large for size-limited license"` hatası verir (bkz. Bölüm 8).

---

## 5. İkinci Yöntem: Genetik Algoritma (Sezgisel/Evrimsel Çözüm)

**Dosya:** `core_engine/geneticalgosolution.py` → `solve_tsp_ga` fonksiyonu

Genetik Algoritma (GA), **doğal seçilim ve evrimi taklit eden** bir optimizasyon tekniğidir. Charles Darwin'in "en güçlü olan hayatta kalır" fikrini, sayılarla/rotalarla oynayarak uygulamış gibi düşünebilirsiniz.

### Adım adım nasıl çalışıyor? (Mala anlatımı + kod referanslı)

1. **Başlangıç popülasyonu oluştur (rastgele "bireyler"):**
   Her "birey", olası bir ziyaret sırasıdır — yani müşterilerin rastgele karıştırılmış bir listesi (`[3, 7, 1, 9, 2, ...]`). Kod, **250 tane** böyle rastgele rota üretir (`pop_size=250`, [geneticalgosolution.py:59](../core_engine/geneticalgosolution.py#L59), [satır 81-86](../core_engine/geneticalgosolution.py#L81-L86)). Bunların hiçbiri başlangıçta iyi değildir — tamamen rastgeledir.

   *Mala anlatımı:* Sanki 250 farklı kişiye "rastgele bir teslimat sırası söyle" demişsiniz gibi. Çoğu saçma olacak ama içlerinden birkaçı şans eseri makul olabilir.

2. **Uygunluk (fitness) skorunu hesapla:**
   Her rotanın toplam mesafesi hesaplanır (`route_distance` fonksiyonu, [satır 74-79](../core_engine/geneticalgosolution.py#L74-L79)). Daha kısa mesafe = daha "uygun"/iyi birey. Bu hesaplamayı hızlandırmak için, tüm nokta çiftleri arasındaki mesafeler **önceden bir tabloya (`dist_matrix`)** yazılır — böylece aynı mesafe defalarca yeniden hesaplanmaz ([satır 69-72](../core_engine/geneticalgosolution.py#L69-L72)).

3. **En iyileri doğrudan bir sonraki nesle taşı (Elitizm):**
   Popülasyonun en iyi **%10'u** (yani en kısa rotaya sahip 25 birey), hiç değiştirilmeden bir sonraki nesle aynen aktarılır ([satır 88, 95](../core_engine/geneticalgosolution.py#L88)). Böylece "şimdiye kadar bulunan en iyi çözüm" asla kaybolmaz.

   *Mala anlatımı:* "En başarılı 25 kişiyi olduğu gibi tut, onları kaybetme — gerisini yeniden dene."

4. **Ebeveyn seçimi (Turnuva Seçimi):**
   Yeni bireyler üretmek için, popülasyondan rastgele **3'erli gruplar** seçilir ve her grubun en iyisi (en kısa rotaya sahip olanı) "ebeveyn" olarak seçilir ([satır 98-99](../core_engine/geneticalgosolution.py#L98-L99)). Bu işlem iki kez yapılır → iki ebeveyn (`p1`, `p2`) elde edilir.

   *Mala anlatımı:* "Rastgele 3 kişi seç, aralarından en iyisini ebeveyn yap." Bu, hem iyi bireylerin seçilme şansını artırır hem de tamamen rastgeleliği koruyarak çeşitliliği kaybetmez.

5. **Çaprazlama / Üreme (Order Crossover - OX):**
   İki ebeveynin rotalarından yeni bir "çocuk" rota üretilir ([satır 101-111](../core_engine/geneticalgosolution.py#L101-L111)):
   - Birinci ebeveynden rastgele bir **bölüm** (örneğin 3. ile 7. sıradaki müşteriler) doğrudan kopyalanır.
   - Geri kalan boşluklar, ikinci ebeveynin sırasına sadık kalınarak — ama zaten kopyalanmış olan müşteriler atlanarak — doldurulur (bu kontrol artık hızlı bir `set` yapısıyla yapılıyor, [satır 106-107](../core_engine/geneticalgosolution.py#L106-L107)).

   *Mala anlatımı:* İki ebeveynin "DNA"sından parçalar alıp yeni, geçerli bir rota (her müşteriyi tam bir kez içeren) inşa etmek gibi düşünün — anne-babanın özelliklerini karıştırıp yeni bir çocuk üretmeye benzer.

6. **Mutasyon (Swap Mutation):**
   %10 ihtimalle, üretilen çocuk rotada rastgele iki müşterinin yerleri değiştirilir ([satır 113-115](../core_engine/geneticalgosolution.py#L113-L115)).

   *Mala anlatımı:* Arada sırada "rastgele küçük bir şans faktörü" katmak — bu, algoritmanın **aynı çözümde takılı kalmasını** (yerel optimumda sıkışmasını) önler. "Belki de hiç denemediğimiz bir kombinasyon daha iyidir" diye küçük bir karıştırma yapmak gibi.

7. **Bu döngüyü 800 kez tekrarla (nesil sayısı = 800):**
   Her tekrara "**nesil (generation)**" denir. 800 nesil boyunca popülasyon sürekli "elenir, eşleşir, mutasyona uğrar" ve teorik olarak her nesilde biraz daha iyiye doğru evrilir ([satır 90](../core_engine/geneticalgosolution.py#L90), `generations=800`).

8. **Sonuç:**
   800 nesil sonunda, popülasyondaki **en kısa rotaya sahip birey** seçilir ve nihai "ziyaret sırası" olarak döndürülür ([satır 120-122](../core_engine/geneticalgosolution.py#L120-L122)).

### Avantajı ve dezavantajı

- ✅ **Avantaj:** Çok hızlıdır ve müşteri sayısı arttıkça performansı Gurobi kadar dramatik kötüleşmez. Lisans/boyut sınırlaması yoktur.
- ❌ **Dezavantaj:** **Stokastiktir** (rastgelelik içerir) — aynı veriyle bile her çalıştırmada biraz farklı (genelde birbirine yakın ama bazen daha iyi/kötü) sonuçlar üretebilir. "Kesinlikle en iyisi budur" garantisi vermez; sadece "çok iyiye yakın, makul bir süre içinde bulunmuş" bir çözüm sunar.

> 📌 **Not — PDF'teki tasarım notlarıyla farkı:** Projeye eklenmiş olan "Genetic Algorithm.pdf" dosyasındaki tasarım notları, fitness fonksiyonunun Faz 2/Faz 3'ü de (yani enerji/fizibilite kontrolünü) içine alan, fizibil olmayan çözümlere ağır ceza puanı (`999999` gibi) veren daha karmaşık bir yapı öneriyor. **Gerçek kodda** ise GA'nın fitness fonksiyonu (Faz 1 — `route_distance`) yalnızca **rota uzunluğuna** bakıyor; enerji/fizibilite kontrolü ayrı bir aşamada (Faz 2 — `run_rts_algorithm`, hem Gurobi hem GA için ortak) yapılıyor. Bu, PDF'teki notların daha çok "ideal/akademik tasarım fikirleri" olduğunu, projenin ise daha sade ve modüler bir yapı tercih ettiğini gösteriyor — iki yaklaşım da geçerlidir, ama kodun şu anki hali "fitness = sadece mesafe, fizibilite kontrolü ayrı bir filtre" mantığıyla çalışıyor.

---

## 6. Karşılaştırma (Compare) Özelliği — İki Algoritmayı Yarıştırmak

Bu proje sadece tek tek algoritma çalıştırmakla kalmıyor, **ikisini doğrudan karşılaştırmak** için iki farklı mod sunuyor:

### 6.1. Tekli (Anlık) Karşılaştırma — "İki Algoritmayı Karşılaştır" düğmesi

`api/main.py` içindeki `/api/compare` uç noktası (endpoint), Gurobi ve Genetik Algoritma'yı **aynı veri seti ve aynı ayarlarla, eşzamanlı (concurrent thread'ler ile)** çalıştırır ([api/main.py:159-206](../api/main.py#L159-L206)). `ThreadPoolExecutor` kullanılarak iki çözücü paralelde başlatılır — böylece toplam bekleme süresi, ikisinin toplamı değil, **daha yavaş olanının süresi kadar** olur.

Sonuçlar arayüzde:
- **İki ayrı haritada yan yana** (sol: Gurobi, sağ: Genetik Algoritma) görselleştirilir,
- Altında otomatik bir **Detaylı Karşılaştırma Raporu** oluşturulur: toplam operasyon süresi, durak sayısı, toplam kamyon mesafesi, teslim edilen paket sayısı, drone tipi dağılımı, kazanan algoritma ve iyileşme yüzdesi.

### 6.2. Toplu / Ortalamalı Karşılaştırma — "N Defa Çalıştır ve Ortala"

Tek seferlik bir karşılaştırma, özellikle **stokastik olan Genetik Algoritma için** yanıltıcı olabilir (şans eseri o gün iyi/kötü bir sonuç üretmiş olabilir). Bu yüzden kullanıcı bir sayı (N) girip iki algoritmayı **N kere art arda** çalıştırabiliyor.

Bunun arkasındaki mekanizma (`/api/compare-batch` ve `_run_batch_job`, [api/main.py:47-112](../api/main.py#L47-L112)):

- İki algoritma **sıralı (ardışık)** çalıştırılır — eşzamanlı değil. Bunun nedeni: eğer ikisi aynı anda çalışırsa, bilgisayarın işlemcisini paylaşırlar ve **CPU ölçümleri birbirine karışır/bozulur**. Sıralı çalıştırma, her algoritmanın CPU tüketimini **temiz ve izole** şekilde ölçmemizi sağlar.
- Her çalıştırma için şu üç şey **gerçekten ölçülür** (hiçbir veri simüle/uydurulmaz):
  1. **`total_time`** — bulunan çözümün operasyon süresi (çözüm kalitesi),
  2. **CPU süresi** — `psutil.Process().cpu_times()` ile ölçülen gerçek `user + system` işlemci zamanı (yani bilgisayarın bu hesaplama için **gerçekten ne kadar işlemci gücü harcadığı**),
  3. **Wall-clock (gerçek zaman) süresi** — `time.perf_counter()` ile ölçülen, "kronometre ile saatin ne kadar ilerlediği" — yani kullanıcının gerçekte ne kadar beklediği.
- Bir arka plan iş (background job) deseni kullanılır: İstek geldiğinde sunucu hemen bir `job_id` döner ve hesaplamayı ayrı bir **daemon thread**'de arka planda başlatır. Arayüz, bu `job_id` ile periyodik olarak (1.2 saniyede bir) `/api/compare-batch/status/{job_id}` uç noktasını "yokluyor" (polling) ve canlı ilerleme bilgisini ("Çalıştırma 7 / 50", "Şu anda çalışıyor: Genetik Algoritma") bir **modal pencerede** gösteriyor.
- Tüm çalıştırmalar bitince `_summarize` fonksiyonu ([api/main.py:34-44](../api/main.py#L34-L44)) her metrik için **ortalama, minimum, maksimum ve standart sapma** hesaplar; ayrıca her çalıştırmada hangi algoritmanın daha düşük (daha iyi) `total_time` ürettiği sayılarak **"kazanma sayısı"** belirlenir.

#### "CPU süresi" ile "wall-clock süresi" arasındaki fark nedir? (mala anlatımı)

- **Wall-clock süre:** Duvardaki saate bakıp "bu iş başladı, bitti, aradan 12 saniye geçti" demek gibidir — gerçek hayatta geçen zamandır.
- **CPU süresi:** "Bilgisayarın işlemcisi bu iş için gerçekten ne kadar 'çalıştı'" demektir. Eğer bilgisayar **birden fazla çekirdeği aynı anda** kullanıyorsa (Gurobi'nin Branch & Bound algoritması çok-iş-parçacıklı/multi-threaded çalışabilir), CPU süresi **wall-clock süresinden daha büyük** çıkabilir (örneğin 4 çekirdek aynı anda 1 saniye çalışırsa, wall-clock 1 saniye ama CPU süresi ~4 saniyedir). Genetik Algoritma ise bu projede çoğunlukla **tek iş parçacıklı (single-threaded)** Python kodu olduğundan, CPU süresi ile wall-clock süresi birbirine yakın çıkar.

#### Neden Gurobi'nin standart sapması her zaman `0.00` çıkıyor?

Çünkü Gurobi **deterministiktir** — yani bir "şans" unsuru içermez. Aynı veri ve aynı ayarlarla her çalıştırıldığında **matematiksel olarak kanıtlanmış en iyi sonucu** üretir, ve bu sonuç her seferinde birebir aynıdır. Dolayısıyla 50 kere çalıştırsanız da `total_time` değeri 50 kere de tıpatıp aynı çıkar → standart sapma = 0. Bu bir hata değil, **beklenen ve doğru bir davranıştır**; aslında Gurobi'nin "kesinlik" garantisinin kanıtıdır.

Genetik Algoritma'da ise her çalıştırmada rastgelelik (başlangıç popülasyonu, ebeveyn seçimi, mutasyon) farklı olduğundan, `total_time` değerleri çalıştırmadan çalıştırmaya **az da olsa değişir** — bu yüzden standart sapması sıfırdan büyük çıkar. Bu da GA'nın "stokastik" doğasının doğal bir sonucudur.

#### Kaç kere çalıştırmak "kesin" bir kıyas sağlar?

Genetik Algoritma stokastik olduğundan, tek bir çalıştırmanın sonucu "şanslı" ya da "şanssız" bir gün olabilir. İstatistikte genel kabul gören kural, anlamlı bir ortalama ve güven aralığı için **en az 30 bağımsız örnek (çalıştırma)** toplamaktır ("n ≥ 30 kuralı"); daha sağlam ve gürültüye dayanıklı bir sonuç için **50-100 çalıştırma** önerilir. Gurobi tarafı için tekrar tekrar çalıştırmaya gerek yoktur (çünkü deterministiktir, çözüm kalitesi hep aynıdır) — sadece CPU/süre ölçümlerindeki küçük ölçüm gürültüsünü ortalamak isterseniz birkaç kez çalıştırmak faydalı olabilir.

---

## 7. Arayüz (UI) Tarafı — Neler Görüyorsunuz ve Nasıl Çalışıyor?

- **Sol panel (sidebar):** Algoritma seçimi (Gurobi / Genetik), drone sayısı (k), drone/kamyon hızları, batarya limiti, isteğe bağlı özel veri seti yükleme, "Optimizasyonu Başlat" ve "İki Algoritmayı Karşılaştır" düğmeleri, dil seçimi (TR/EN).
- **Sağ panel (ana ekran):** Sonuçlar geldiğinde, harita üzerinde depo (kırmızı), müşteriler (mavi noktalar), planlanan ziyaret sırası (TSP rotası — kesik çizgi) ve gerçekleşen kamyon rotası (kalın çizgi) çizilir. Harita, **Leaflet.js** ile `CRS.Simple` (basit düzlemsel koordinat sistemi — gerçek dünya GPS koordinatı değil, sanal bir X-Y düzlemi) kullanılarak oluşturulmuştur.
- **Karşılaştırma görünümü:** Aktif olduğunda ekran ikiye bölünür — solda Gurobi haritası, sağda Genetik Algoritma haritası — ve altta detaylı/toplu karşılaştırma raporu gösterilir.
- **Dil desteği (i18n):** Tüm metinler (rapor başlıkları, özetler, modal yazıları dahil) bir `translations` nesnesinde TR/EN olarak tutulur; dil değiştirildiğinde aktif olan rapor da otomatik olarak yeni dilde yeniden çizilir.

**Harita "kuş bakışı" görünümü:** Harita, yalnızca TSP rotasına değil; **depo + tüm müşteriler + TSP rotası + kamyon rotasının tamamını** kapsayan birleşik bir sınır kutusuna (`bounds`) göre ortalanır ve yakınlaştırılır — böylece hiçbir nokta kadraj dışında kalmaz, tüm operasyon tek bakışta görülebilir.

---

## 8. Bilinen Sınırlamalar ve Önemli Notlar

### Gurobi'nin lisans/boyut sınırı

Gurobi'nin TSP modelinde değişken sayısı, müşteri sayısının **karesi (~n²)** ile orantılı büyür (çünkü her "i'den j'ye gidiş" ihtimali için bir değişken var). Ücretsiz/sınırlı (size-limited) Gurobi lisansları, belirli bir model boyutunun üzerindeki problemlerde çalışmayı reddeder ve `"Model too large for size-limited license"` hatası fırlatır. Bu yüzden:
- Az müşterili veri setlerinde (örn. 25-50) Gurobi sorunsuz çalışır,
- Müşteri sayısı arttıkça (örn. 100+), sınırlı lisansla Gurobi seçeneği hata verebilir,
- Genetik Algoritma bu sınırlamadan **etkilenmez** (Gurobi'ye bağımlı değildir, herhangi bir lisans gerektirmez).

### `total_time` ile algoritmanın çalışma süresi farklı şeylerdir

Tekrar vurgulamak gerekirse: `total_time`, **bulunan operasyon planının ne kadar süreceğinin tahminidir** (çözüm kalitesi). Algoritmanın "düşünme/hesaplama süresi" ise tamamen ayrı bir kavramdır ve karşılaştırma raporlarında **CPU süresi** ve **wall-clock süresi** olarak ayrı ayrı ölçülüp gösterilir. Bu ikisini birbirine karıştırmamak, raporu doğru yorumlamanın anahtarıdır.

### Neden bazen Gurobi, bazen Genetik Algoritma daha düşük (daha iyi) `total_time` verir? — Bu bir hata mı?

**Hayır, bu bir hata değil — sistemin mimarisinin doğal ve beklenen bir sonucudur.** Burada sıkça yanlış anlaşılan nokta şu: *"Gurobi kesin/exact bir çözücü olduğuna göre, `total_time` karşılaştırmasını da her zaman o kazanmalı"* varsayımı **yanlıştır**, çünkü:

> ⚠️ **Gurobi yalnızca Faz 1'i (TSP — ziyaret sırasını) kesin olarak optimal çözer. `total_time` ise Faz 1 + Faz 2 + Faz 3'ün birleşik (kombine) sonucudur — ve Faz 2/3 (blok bölüştürme, enerji/fizibilite kontrolü, en kısa yol) Gurobi'nin matematiksel modelinin BİR PARÇASI DEĞİLDİR.**

Yani Gurobi'nin "kesinlik garantisi" sadece şu soruya cevap verir: *"Müşterileri hangi sırayla gezersem toplam TSP mesafesi en küçük olur?"* — bu sorunun cevabını **kanıtlanmış şekilde** doğru bulur. Ama nihai `total_time`'ı belirleyen soru farklıdır: *"Bu sıralama, kamyon+drone ekibine bölüştürüldüğünde (bloklara ayrılıp enerji/batarya kısıtlarına uyduğunda) toplamda operasyon ne kadar sürer?"* — işte bu ikinci soruyu Gurobi'nin modeli **hiç görmez/optimize etmez**; bu hesap, Faz 2/3'te (her iki çözücü için de ortak olan `run_rts_algorithm` fonksiyonunda) ayrıca ve bağımsız olarak yapılır.

Sonuç olarak şu durum tamamen mümkündür ve "doğru" bir sonuçtur:

- Gurobi'nin bulduğu tur, **kanıtlanmış şekilde en kısa TSP mesafesine** sahiptir,
- ama bu tur, bloklara bölündüğünde biraz daha az verimli bir drone görev dağılımına ya da daha sınırlayıcı bir fizibilite tablosuna yol açabilir,
- GA'nın bulduğu (TSP açısından biraz daha uzun olan) bir tur ise, bloklara bölündüğünde şans eseri daha iyi bir kombinasyona denk gelip **daha düşük nihai `total_time`** üretebilir.

Kısacası: **"matematiksel olarak en kısa ziyaret sırası" ≠ "nihayetinde en kısa operasyon süresi"**. Bunlar farklı optimizasyon hedefleridir; biri (Gurobi) ilkini kesin çözer, ikincisi ise (gerçek `total_time`) üç fazın bileşik etkileşiminin bir sonucudur ve hiçbir çözücü tarafından doğrudan optimize edilmez. Bu yüzden kıyas raporlarında GA'nın bazen Gurobi'den daha iyi `total_time` üretmesi **şaşırtıcı değildir ve bir "düzeltme" gerektirmez** — aksine, projenin neden "tek bir fazı değil, sistemin tamamını" karşılaştırmanın anlamlı olduğunu gösteren güzel bir örnektir.

> 🔧 **Not:** Eğer ileride Gurobi'nin `total_time` açısından da garantili minimum vermesi istenirse, bunun için ya (a) Gurobi'ye aynı (en kısa) TSP mesafesine sahip birden çok turu bir "çözüm havuzundan" (solution pool) alıp her birini Faz 2/3'ten geçirip en iyisini seçtirmek, ya da (b) tüm üç fazı (blok atama + enerji kısıtları + en kısa yol dahil) tek bir dev MIP modeli olarak yeniden kurmak gerekir. İkinci seçenek "gerçek anlamda kesin minimum" garantisi verir ama model boyutu ve çözüm süresi katlanarak büyür (lisans sınırına çok daha hızlı çarpar). Bu proje şu an için bu karmaşıklığı eklemeden, **mevcut üç-fazlı mimariyi koruyarak** dürüst bir kıyas sunmayı tercih ediyor.

Çalışma süresi (CPU/wall-clock) açısından ise GA genelde sabit bir sürede (250 popülasyon × 800 nesil) çalışırken, Gurobi'nin süresi probleme göre büyük farklılıklar gösterebilir — bazen çok hızlı optimal çözüme ulaşır, bazen dallanma-sınırlama ağacında çok daha uzun gezinir.

---

## 9. Özet — Tek Cümlede Ne Yapıyoruz?

> Bu proje, "kamyon + drone ekibiyle paket dağıtımını en hızlı şekilde nasıl planlarız?" sorusuna **iki farklı zekâ türüyle** (biri "kesin matematik", diğeri "evrimsel tahmin") cevap arıyor, bulunan planları haritada canlandırıyor ve hangisinin gerçekten daha iyi olduğunu **gerçek, ölçülmüş verilerle** (uydurma sayılarla değil) kıyaslıyor.

---

*İlgili diğer doküman: [Karşılaştırma Özelliği Güncelleme Notları](KARSILASTIRMA-GUNCELLEMELERI.md) — bu özelliğin geliştirme sürecinde yapılan değişikliklerin kaydı.*
