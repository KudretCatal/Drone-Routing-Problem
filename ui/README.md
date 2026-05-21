# 🚁 Multi-Visit Drone Routing Problem (MVDRP) Optimization Engine

Bu proje, bir kamyon ve çoklu dronelardan (k=3) oluşan heterojen bir filonun teslimat rotalarını optimize eden çift motorlu bir backend altyapısıdır. 

Sistem iki farklı optimizasyon motoru barındırır:
1. **Gurobi TSP & RTS Engine:** Orijinal makaledeki matematiksel modeli baz alarak kusursuz Gezgin Satıcı (TSP) rotasını çıkarır ve ağırlığa göre dinamik drone ataması yapar.
2. **Genetic Algorithm Engine:** Gurobi'ye alternatif olarak yazılmış, sezgisel (heuristic) yöntemle çalışan, ağırlıkları daha verimli gruplayıp operasyon süresini kısaltabilen yerli motordur.

## 📦 Özellikler
- **Dinamik Drone Seçimi:** Yük ≤ 3.0 kg ise Quadrocopter, > 3.0 kg ise Octocopter otomatik seçilir.
- **Batarya ve Enerji Kontrolü:** Makaledeki aerodinamik enerji harcama fonksiyonları entegredir.
- **Harita Görselleştirme:** Çıktılar `matplotlib` ile 2D düzlemde çizilir.

## 🚀 Kurulum (UI Ekibi İçin)
1. Kütüphaneleri kurun:
`pip install -r requirements.txt`

2. Gurobi lisansınızı aktif edin:
`grbgetkey [LİSANS-KODUNUZ]`

3. Motorlardan birini çalıştırın:
`python core_engine/gurobisolution.py`
veya
`python core_engine/geneticalgosolution.py`

*Not: Arayüz (UI) entegrasyonu yaparken `run_rts_algorithm` fonksiyonunu import ederek doğrudan `total_time` ve `RouteGraph` verilerini arayüze çekebilirsiniz.*