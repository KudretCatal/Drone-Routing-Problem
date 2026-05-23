# k-MVDRP Optimization Engine (Drone Routing Problem)

Bu proje, k-Multi-Visit Drone Routing Problem (k-MVDRP) probleminin çözümüne yönelik geliştirilmiş, yapay zeka ve matematiksel optimizasyon temelli bir **Web Uygulamasıdır**. 

Sistem, bir kamyon (mobil depo) ve k adet drone'un işbirliği yaparak, belirli müşterilere teslimatları en kısa sürede, drone enerji ve batarya limitlerini gözeterek tamamlamasını hedefler.

## ✨ Özellikler

- **Gelişmiş Çözücüler:** Gurobi (Exact Optimizer) veya Genetik Algoritma (Heuristic) seçeneği.
- **Premium Kullanıcı Arayüzü:** Hiçbir dış CSS kütüphanesine bağımlı olmadan yazılmış (Vanilla CSS), karanlık ve aydınlık temalara uyumlu *Glassmorphism* tabanlı web arayüzü.
- **Dinamik Harita (Leaflet.js):** Kamyon rotaları ve Drone/TSP dağıtım ağlarının animasyonlu interaktif haritada çizimi.
- **Dil Desteği (i18n):** Türkçe ve İngilizce anında geçiş desteği.
- **Özel Veri Seti Desteği:** İsteğe bağlı olarak kendi koordinat txt dosyanızı web arayüzünden yükleyip sistemi çalıştırabilme esnekliği.

---

## 🛠️ Kurulum (Kurumsal Standartlar)

Sistemi çalıştırmak için bilgisayarınızda **Python 3.12+** ve aktif bir **Gurobi Akademik/Ticari Lisansı** kurulu olmalıdır.

### 1. Kütüphanelerin Yüklenmesi
Projeyi bilgisayarınıza indirdikten sonra, projenin kök dizininde (`Drone-Routing-Problem`) bir terminal açarak gerekli Python kütüphanelerini kurun:

```bash
pip install -r requirements.txt
```
*(Bu komut; `networkx`, `gurobipy`, `matplotlib`, `fastapi`, `uvicorn` ve `python-multipart` paketlerini kuracaktır.)*

### 2. Gurobi Lisansı (Eğer henüz yapmadıysanız)
Gurobi kullanabilmek için lisans anahtarınızı terminalden aktifleştirmeniz gerekir:
```bash
grbgetkey SIZIN-LISANS-ANAHTARINIZ
```

---

## 🚀 Projeyi Çalıştırma

Proje modern bir REST API mimarisi üzerine kurulmuştur. **Python sunucusu** arka planda matematiksel hesapları yaparken, **HTML/JS arayüzü** kullanıcılara sonuçları sunar.

### Adım 1: Backend Sunucusunu Başlatın
Terminalinizde proje kök dizinindeyken aşağıdaki komutu çalıştırarak FastAPI sunucusunu başlatın:

```bash
python api/main.py
```
> Sunucu başarıyla başladığında `Uvicorn running on http://0.0.0.0:8000` mesajını göreceksiniz. Lütfen bu terminal penceresini **kapatmayın**.

### Adım 2: Kullanıcı Arayüzünü Açın
Backend sunucusu çalışırken, herhangi bir web tarayıcısı (Chrome, Edge vb.) ile projedeki arayüz dosyasını açın:

📁 `ui/index.html` dosyasına **çift tıklayarak** tarayıcınızda açabilirsiniz.

---

## 🎮 Kullanım Rehberi

1. Tarayıcıda açtığınız arayüzde sağ üst kısımdan dil seçiminizi (EN/TR) yapın.
2. Sol menüden çözücü algoritmayı (**Gurobi** veya **Genetic Algorithm**) seçin.
3. Operasyona katılacak **Drone Sayısını (k)**, drone/kamyon **hızlarını** ve **batarya limitini** belirleyin.
4. *(İsteğe Bağlı)* Hazırladığınız veya elinizde bulunan bir `veri_seti.txt` koordinat dosyasını panele yükleyin. Dosya seçilmezse sistem varsayılan dosyayı kullanacaktır.
5. **Optimizasyonu Başlat** butonuna tıklayın. 
6. Hesaplamalar bittiğinde (Gurobi için ~1100 saniye sürebilir), detaylı kamyon hareket adımları sol tarafta listelenecek ve harita kamerası otomatik olarak oluşturulan rotaların üzerine odaklanacaktır.

---
**Mimari Not:** Proje "Clean Architecture" prensiplerine sadık kalarak inşa edilmiştir. `core_engine` modülü içerisinde bulunan yapay zeka modelleri bağımsız çalışabilir yapıdadır ve `api` katmanı ile iletişim koparılmıştır. Bütün teknik loglar Türkçe olarak konsola basılır.