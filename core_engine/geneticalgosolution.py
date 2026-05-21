import math
import random
import networkx as nx
import matplotlib.pyplot as plt

# ==========================================
# 1. VERİ OKUMA VE DİNAMİK ENERJİ FONKSİYONLARI
# ==========================================

def get_energy_rate(weight, drone_type="quad"):
    """Makalenin Appendix A bölümündeki ağırlığa bağlı resmi enerji formülleri."""
    if drone_type == "quad":
        points = [(0.0, 31.000), (0.375, 33.110), (0.750, 35.364), (1.125, 37.712),
                  (1.500, 40.342), (1.875, 43.088), (2.250, 46.021), (2.625, 49.154), (3.000, 52.500)]
    else: # Makaledeki Octocopter Verileri (Ağır Yükler İçin)
        points = [(0.0, 200.00), (2.5, 217.41), (5.0, 236.34), (7.5, 256.92), (10.0, 279.28),
                  (12.5, 303.60), (15.0, 330.03), (17.5, 358.77), (20.0, 390.00)]
    
    for i in range(len(points) - 1):
        w1, e1 = points[i]
        w2, e2 = points[i+1]
        if w1 <= weight <= w2:
            return e1 + (e2 - e1) * (weight - w1) / (w2 - w1)
    return points[-1][1]

def load_dataset(filepath):
    """Solomon TXT dosyasından verileri çeker."""
    customers = []
    weights = []
    data_lines = []
    
    with open(filepath, 'r') as file:
        lines = file.readlines()
        
    for line in lines:
        parts = line.strip().split()
        if parts and parts[0].isdigit() and len(parts) >= 4:
            data_lines.append(parts)
            
    depot_line = data_lines[0]
    depot_coord = (float(depot_line[1]), float(depot_line[2]))
    
    for parts in data_lines[1:]:
        x, y, w = float(parts[1]), float(parts[2]), float(parts[3])
        customers.append((x, y))
        weights.append(w)
        
    V_locs = {0: depot_coord}
    for idx, coord in enumerate(customers):
        V_locs[idx + 1] = coord
        
    return depot_coord, customers, weights, V_locs

# ==========================================
# 2. GENETİK ALGORİTMA TSP MOTORU (PHASE 1)
# ==========================================

def solve_tsp_ga(customer_coords, depot_coord, pop_size=100, generations=300):
    """Gurobi bağımlılığı olmadan rotayı optimize eden Genetik Algoritma."""
    print("Phase 1: Genetik Algoritma çalışıyor, evrim başladı...")
    
    all_nodes = [depot_coord] + customer_coords
    num_customers = len(customer_coords)
    
    def route_distance(route):
        dist = math.dist(depot_coord, all_nodes[route[0]])
        for i in range(len(route)-1):
            dist += math.dist(all_nodes[route[i]], all_nodes[route[i+1]])
        dist += math.dist(all_nodes[route[-1]], depot_coord)
        return dist
        
    population = []
    base_route = list(range(1, num_customers + 1))
    for _ in range(pop_size):
        ind = base_route[:]
        random.shuffle(ind)
        population.append(ind)
        
    for gen in range(generations):
        population = sorted(population, key=route_distance)
        new_pop = population[:int(pop_size * 0.1)] # Elitizm
        
        while len(new_pop) < pop_size:
            p1 = min(random.sample(population, 3), key=route_distance)
            p2 = min(random.sample(population, 3), key=route_distance)
            
            start, end = sorted(random.sample(range(num_customers), 2))
            child = [-1] * num_customers
            child[start:end+1] = p1[start:end+1]
            
            ptr = 0
            p2_filtered = [x for x in p2 if x not in child]
            for i in range(num_customers):
                if child[i] == -1:
                    child[i] = p2_filtered[ptr]
                    ptr += 1
                    
            if random.random() < 0.1:
                idx1, idx2 = random.sample(range(num_customers), 2)
                child[idx1], child[idx2] = child[idx2], child[idx1]
                
            new_pop.append(child)
        population = new_pop
        
    best_route = min(population, key=route_distance)
    print(f"Genetik Algoritma Başarılı! Rota Sırası: {[0] + best_route + [0]}")
    return [0] + best_route

# ==========================================
# 3. BLOK ATAMA VE SHORTEST PATH (DİNAMİK DRONE SEÇİMLİ)
# ==========================================

def run_rts_algorithm(visit_order, V_locations, customer_coords, customer_weights, k, EMAX, drone_speed, truck_speed):
    print("Phase 2: Block Partitioning ve Enerji Hesabı Yapılıyor (Dinamik Drone Modeli Aktif)...")
    G = nx.DiGraph()
    total_customers = len(customer_coords)
    
    for v_id in V_locations.keys():
        for j in range(total_customers + 1):
            G.add_node((v_id, j))
            
    for i1 in V_locations.keys():
        for i2 in V_locations.keys():
            truck_dist = math.dist(V_locations[i1], V_locations[i2])
            truck_time = truck_dist / truck_speed
            
            for j1 in range(total_customers + 1):
                for j2 in range(j1, total_customers + 1):
                    
                    if j1 == j2:
                        G.add_edge((i1, j1), (i2, j2), weight=truck_time, details="Sadece Kamyon Hareket Etti (Drone Uçuşu Yok)")
                        continue
                        
                    packages_to_deliver = visit_order[j1+1 : j2+1]
                    block_size = math.ceil(len(packages_to_deliver) / k)
                    
                    is_feasible = True
                    max_drone_time = 0
                    drone_tasks = [] 
                    
                    for d in range(k):
                        start_idx = d * block_size
                        end_idx = min((d + 1) * block_size, len(packages_to_deliver))
                        drone_packages = packages_to_deliver[start_idx:end_idx]
                        
                        if not drone_packages: break
                        
                        # Toplam ağırlığı hesapla ve drone seç
                        total_weight = sum([customer_weights[p-1] for p in drone_packages])
                        
                        if total_weight <= 3.0:
                            selected_drone = "quad"
                            drone_name = "Quadrocopter"
                        else:
                            selected_drone = "octo"
                            drone_name = "Octocopter"
                        
                        drone_tasks.append(f"Drone {d+1} ({drone_name} - Yük: {total_weight:.2f} kg) -> Paketler: {drone_packages}")
                            
                        energy_used = 0
                        current_weight = total_weight
                        
                        dist_to_first = math.dist(V_locations[i1], customer_coords[drone_packages[0]-1])
                        energy_used += dist_to_first * get_energy_rate(current_weight, selected_drone)
                        
                        dist_between = 0
                        if len(drone_packages) > 1:
                            for p_idx in range(len(drone_packages)-1):
                                current_weight -= customer_weights[drone_packages[p_idx]-1]
                                step_dist = math.dist(customer_coords[drone_packages[p_idx]-1], customer_coords[drone_packages[p_idx+1]-1])
                                dist_between += step_dist
                                energy_used += step_dist * get_energy_rate(current_weight, selected_drone)
                            
                        dist_to_truck = math.dist(customer_coords[drone_packages[-1]-1], V_locations[i2])
                        energy_used += dist_to_truck * get_energy_rate(0.0, selected_drone)
                        
                        drone_dist = dist_to_first + dist_between + dist_to_truck
                        d_time = drone_dist / drone_speed
                        if d_time < truck_time:
                            hover_power = get_energy_rate(0.0, selected_drone) * drone_speed
                            energy_used += (truck_time - d_time) * hover_power
                            
                        if energy_used > EMAX:
                            is_feasible = False
                            break
                            
                        if d_time > max_drone_time:
                            max_drone_time = d_time
                            
                    if is_feasible:
                        operation_time = max(truck_time, max_drone_time)
                        task_report = " | ".join(drone_tasks)
                        G.add_edge((i1, j1), (i2, j2), weight=operation_time, details=task_report)

    print("Phase 3: En Kısa Yol (Shortest Path) Bulunuyor...")
    try:
        total_time = nx.shortest_path_length(G, source=(0, 0), target=(0, total_customers), weight='weight')
        best_path = nx.shortest_path(G, source=(0, 0), target=(0, total_customers), weight='weight')
        return total_time, best_path, G
    except nx.NetworkXNoPath:
        return None, None, None


# ==========================================
# 4. HARİTA GÖRSELLEŞTİRME (MATPLOTLIB)
# ==========================================

def plot_routes(depot_coord, customer_coords, visit_order, best_path, V_locs):
    print("Phase 4: Harita Çiziliyor...")
    plt.figure(figsize=(12, 8))

    # 1. Depoyu Çiz (Kırmızı Kare)
    plt.scatter(*depot_coord, c='red', marker='s', s=150, label='Depo (0)', zorder=5)
    plt.text(depot_coord[0] + 100, depot_coord[1] + 100, '0 (Depo)', fontsize=12, weight='bold', color='red')

    # 2. Müşterileri Çiz (Mavi Noktalar)
    for idx, coord in enumerate(customer_coords):
        plt.scatter(*coord, c='blue', s=60, zorder=5)
        plt.text(coord[0] + 100, coord[1] + 100, str(idx+1), fontsize=10)

    # 3. Drone Paket Dağıtım Sırasını Çiz (Kesik Gri Çizgi)
    all_nodes = [depot_coord] + customer_coords
    draw_order = visit_order + [0] # Haritada depoya geri dönsün diye sonuna 0 ekliyoruz
    tsp_x = [all_nodes[i][0] for i in draw_order]
    tsp_y = [all_nodes[i][1] for i in draw_order]
    plt.plot(tsp_x, tsp_y, linestyle=':', color='gray', alpha=0.7, label='Planlanan Ziyaret Sırası (TSP)')

    # 4. Kamyon Rotasını Çiz (Faz 3'te Bulunan Kamyonun Fiziksel Durakları - Kalın Siyah Çizgi)
    truck_x = []
    truck_y = []
    for node in best_path:
        physical_node = node[0] 
        truck_x.append(V_locs[physical_node][0])
        truck_y.append(V_locs[physical_node][1])

    plt.plot(truck_x, truck_y, linestyle='-', linewidth=2.5, color='black', label='Kesinleşen Kamyon Rotası')

    # Harita Ayarları
    plt.title('Genetik Algoritma - Multi-Visit Drone Routing Haritası', fontsize=14, weight='bold')
    plt.xlabel('X Koordinatı')
    plt.ylabel('Y Koordinatı')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    
    # Çizimi Ekranda Göster
    plt.show()

# ==========================================
# ANA ÇALIŞTIRMA BLOĞU
# ==========================================
if __name__ == "__main__":
    
    try:
        # 1. ADIM: VERİYİ TXT'DEN OKU
        depot, customers, weights, V_locs = load_dataset("../data/veri_seti.txt")
        print(f"Sistemdeki Müşteri Sayısı: {len(customers)}")

        # 2. ADIM: GENETİK ALGORİTMA İLE ROTAYI BUL
        visit_order = solve_tsp_ga(
            customer_coords=customers, 
            depot_coord=depot, 
            pop_size=150, 
            generations=400
        )
        
        # 3. ADIM: ENERJİ KONTROLÜ VE ŞAMPİYONLUK YOLU
        total_time, best_path, RouteGraph = run_rts_algorithm(
            visit_order=visit_order,
            V_locations=V_locs,
            customer_coords=customers,
            customer_weights=weights,
            k=3, 
            EMAX=540000, 
            drone_speed=10,
            truck_speed=5
        )
        
        if total_time:
            print("\n" + "="*75)
            print(f"✅ İŞLEM TAMAM (GENETİK ALGORİTMA): Toplam Operasyon Süresi = {total_time:.2f} saniye")
            print("="*75)
            print("📍 OPERASYON VE SEÇİLEN DRONE TİPİ DETAYLARI:")
            
            for i in range(len(best_path)-1):
                kalkis_dugumu = best_path[i]
                varis_dugumu = best_path[i+1]
                
                kamyon_kalkis = kalkis_dugumu[0]
                kamyon_varis = varis_dugumu[0]
                
                kenar_bilgisi = RouteGraph.get_edge_data(kalkis_dugumu, varis_dugumu)
                yapilan_is = kenar_bilgisi['details']
                
                print(f"\nAdım {i+1}: Kamyon {kamyon_kalkis}. Duraktan -> {kamyon_varis}. Durağa Geçti.")
                print(f"   └─> {yapilan_is}")
                
            print("\n" + "="*75)
            
            # RAPOR BİTİNCE HARİTAYI ÇİZ
            plot_routes(depot, customers, visit_order, best_path, V_locs)
            
        else:
            print("\n❌ HATA: Drone'ların bataryası veya kapasitesi bu rotayı tamamlamaya yetmedi.")
            
    except FileNotFoundError:
        print("\n❌ HATA: 'veri_seti.txt' dosyası kodla aynı klasörde bulunamadı!")