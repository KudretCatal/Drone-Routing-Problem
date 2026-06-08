

![][image1]

**FACULTY of ENGINEERING and NATURAL SCIENCES**

**MULTIDISCIPLINARY FACULTY ELECTIVE**

**ENS001 Application Development for Optimization**

**PROJECT REPORT**

**Team 20**

**GENERAL INFORMATION**

| Student ID | Name | Surname | Department |
| ----- | ----- | ----- | ----- |
| **2309051039** | **Defne Dilara** | **Can** | **Industrial Engineering** |
| **2309051006** | **Melek** | **Yiğit** | **Industrial Engineering** |
| **2309111039** | **Sami Atalay** | **Şerbet** | **Software Engineering** |
| **2309111085** | **Meriç** | **Baş** | **Software Engineering** |
| **220901584** | **Kudret** | **Çatal** | **Computer Engineering** |

| Project Name: |  |
| :---- | :---- |
| **Course Instructor(s):** |  |

**SUMMARY**

The summary should include the purpose, scope, methodology, and general content of the project. Towards the conclusion of the abstract, a brief summary of the project's findings, including verification outcomes, and the primary setbacks should be included.

Explain the (a) originality, (b) methodology, (c) project management, and (d) practical and managerial implications of the research topic in detail.

It is recommended that this section be written last.

| Summary-maks 450 kelime This project focuses on solving the k-Multi-visit Drone Routing Problem (k-MVDRP), a logistical challenge involving a truck and *k* drones where drones can deliver multiple packages in a single trip. The purpose of the study is to evaluate the performance of an alternative optimization tool, specifically a Genetic Algorithm (GA),   against the traditional solver-based approach (Gurobi) used in the original literature. Due to the inaccessibility of the original dataset from Paper-10, the scope of this project includes the generation of a custom dataset following the original paper's specifications: a 25 km x 25 km area with 25 or 50 customers and launch locations. The generation process utilizes uniform random distributions for coordinates, package weights between 0 and 2.3 kg, a constant truck speed of 5 m/s, and drone speeds of 10 or 15 m/s. Furthermore, the input parameters account for Quadrocopter and Octocopter drone types with battery masses of 1 kg and 10 kg, energy densities of 540,000 J/kg and 900,000 J/kg, a variable number of drones (*k*) ranging from 1 to 8, and a fixed random seed of 42 to ensure experimental reproducibility. The methodology is built upon the Route-Transform-Shortest Path (RTS) heuristic. Following the generation of custom data, Phase 1 (Route-VisitOrder) was solved using Gurobi to replicate the standard TSP-based sequence. Then, the Genetic Algorithm was implemented as the primary alternative tool to find optimal routing solutions. The project aims to benchmark these two approaches to determine if the Genetic Algorithm offers a more optimal makespan for this complex routing problem. (253  kelime)  EKLENECEKLER: Ben hangi inputların kullanıldığını ve nasıl bir yol izlendiğini yazdım, Genetik algoritma temelde nasıl yapıldı, Gurobi sonucu ne-Genetik algoritma sonucu ne, karşılaştırılması nasıl yapıldı eklenmeli.   |
| :---- |
| **Keywords:** At least 3 and at most 5 words should be written and a comma should be placed between the words. |

1. **ORIGINALITY**

 **1.1. Importance of the Topic, Originality of the Research Topic and Research Questions/Hypothesis**

In the research proposal, the scope and boundaries of the topic discussed, and its importance are explained with qualitative or quantitative data as well as a critical evaluation of the literature.

While writing the original value, the scientific value of the research proposal, its difference and innovation, how it will eliminate the deficiency or what kind of solution it will develop to which problem, and/or what original contributions it will make conceptually, theoretically and/or methodologically to the relevant science or technology fields are referenced to the literature. is explained by doing.

The research question of the proposed study and its hypothesis, if any, or the problem(s) it addresses are clearly stated.

| The integration of drone-truck tandem delivery systems into modern logistics is a critical area of research, driven by the need for faster and more sustainable delivery solutions. This research focuses on the *k*\-Multi-visit Drone Routing Problem (*k*\-MVDRP), a complex optimization challenge where drones can carry multiple packages and visit several customers in a single sortie while managing weight-dependent energy constraints.  The originality of this research is defined by its comparative evaluation of two distinct computational tools; a heuristic solver (Gurobi) and a metaheuristic Genetic Algorithm (GA) within the established Route-Transform-Shortest Path (RTS) framework. By maintaining the original heuristic structure, the study creates a controlled environment to measure the impact of the solver choice on the final makespan and computational efficiency. This approach addresses a specific gap in the literature regarding the effectiveness of metaheuristics compared to exact solvers when applied to the same multi-visit delivery sequences. Furthermore, the scientific value of this project is reinforced by the development of a custom-generated, reproducible dataset.(Bunu da ekledim özgünlük olarak ama siledebilirim?)  EKLENECEKLER: Yine teknik kısımlar ile güçlendirilebilir  |
| :---- |

2. **Purpose and Goals**

     
The purpose and goals of the research proposal are written in a clear, measurable, realistic, and achievable way throughout the research period.

| The primary purpose of this research is to minimize the total route completion time, or makespan, for the *k*\-Multi-visit Drone Routing Problem (*k*\-MVDRP) by evaluating the effectiveness of distinct computational optimization tools. The project focuses on a tandem delivery system consisting of one truck and *k* drones, where drones are capable of performing multiple deliveries in a single trip while adhering to realistic, weight-dependent energy constraints. By utilizing the three-phase Route-Transform-Shortest Path (RTS) heuristic framework, the study aims to coordinate the fleet such that all packages are delivered and all vehicles return to the warehouse in the minimum time possible.  A central goal of this project is to perform a rigorous benchmarking analysis comparing a high-end commercial solver, Gurobi, with an alternative metaheuristic approach, the Genetic Algorithm (GA). The objective is to determine if the Genetic Algorithm can provide competitive or superior results in terms of route optimality and computational efficiency when applied to the routing and assignment tasks of the RTS heuristic.  Another measurable goal is the development and validation of a custom-generated, reproducible dataset to serve as the project's experimental foundation. (bunu da kendimiz çalıştırdığımız için eklenmeli diye düşündüm.)  By first using Gurobi to establish a baseline Traveling Salesman Problem (TSP) visit order and then solving the subsequent phases with the Genetic Algorithm, the project aims to verify the feasibility of all drone sorties and provide a clear performance comparison between exact and metaheuristic solution methods. (Teoride biz Melek’le böyle yapılmasını planlamıştık ama uygulamada farklılaştırdıysanız düzenlemeleri ona göre yapın.)  |
| :---- |

2. **METHODOLOGY**

The methods and research techniques to be applied in the research proposal (including data collection tools and analysis methods) are explained with reference to the relevant literature. It is demonstrated that the methods and techniques are suitable for achieving the aims and objectives envisaged in the study.

The methods section should cover the design of the research, dependent and independent variables, and statistical methods. If any preliminary studies or feasibility studies have been carried out in the research proposal, they are expected to be presented. The methods presented in the research proposal must be associated with the work packages.

| 2.1 Research Design This study employs a comparative algorithmic research design to evaluate the effectiveness of a proposed evolutionary approach against a pre-established heuristic framework. The methodology is structured into two primary phases to ensure an exact and controlled validation of the proposed improvements. Phase 1 \- Baseline Establishment: In the initial phase, the original RTS algorithm, as formulated in the reference literature, is reconstructed. This algorithm is implemented without any enhancements to serve as an objective baseline. Establishing this benchmark is crucial for quantifying the exact degree of improvement introduced by the new algorithm. Phase 2 \- Genetic Algorithm: The second phase introduces a Genetic Algorithm (GA) designed to overcome the static routing limitations observed in the baseline heuristic. While the GA fundamentally changes the search mechanism by introducing dynamic, population-based evolutionary operators, it strictly adheres to the original mathematical constraints, including drone energy capacities (EMAX) and simultaneous launch limits (k). The core objective of this design is to conduct a benchmark analysis that measures the percentage improvement in the total operational time (Tmax) achieved by the evolutionary model compared to the static baseline. 2.2 Variables To evaluate the performance of the proposed Genetic Algorithm (GA) against the baseline RTS algorithm, a comprehensive experimental design is constructed. The system's efficiency is measured through defined dependent variables which are driven by systematically altered independent variables capturing both problem scales and algorithmic parameters. Independent Variables 1.Problem Scale Parameters: Number of Customers (|C|): Represents the total number of nodes that the algorithm will search for a solution. Number of Drones (k): Indicates the maximum number of drones that can be launched simultaneously from the truck at the meeting points.  2.GA Hyperparameters: Population Size: The total number of alternative route solutions competing simultaneously in each generation. Crossover Rate: The probability of creating new offspring by combining the genetic information of selected parent routes (e.g 0.85). Mutation Rate: The probability of randomly swapping the positions of customers within a route to avoid getting trapped in local optima in subsequent generations. Elitism Count:pzt eklenecek Varsa başka ekstra parametreler eklenecek.  Dependent Variables Total Operational Time (Tmax): Total operational time is the total time it takes for trucks and drones to complete the entire package delivery process and return to the warehouse. Represents the original objective function value of the article. The aim is to minimize this time. CPU Time / Execution Time: The time an algorithm spends in the computer processor from its starting point until it reaches the optimal or stopping criterion. Bunu kendim yazmadm ai dan aldım tanımını bi bakın Improvement (%): Indicates the time saving achieved by the developed Genetic Algorithm (GA) compared to the original RTS algorithm in the article. Improvement (%) \= ( ( TRTSmax-    TGAmax)  / TRTSmax)  x 100  2.3 Data Collection & Statistical Methods Due to the unavailability of the original benchmark instances from the reference literature, randomly generated datasets were systematically generated strictly adhering to the instance generation procedures outlined in the original study. To simulate the operational environment, a 25 km x 25 km coordinate system was established. Within this continuous grid, customer locations (C) and the central depot (v0) were populated utilizing a uniform random distribution. To maintain methodological consistency with the literature, all travel times were computed using Euclidean distances divided by the respective constant velocities of the truck and the drones. For the analytical evaluation phase, a pairwise comparison strategy is employed. Both the baseline RTS and the proposed GA are executed across identical synthetic instances (e.g. buraya örnek yazabiliriz). The primary statistical metric utilized to evaluate the algorithmic performance is the relative percentage improvement in the total operational time (Tmax). By comparatively calculating the time reduction achieved by GA compared to the RTS baseline model, the study ensures a robust and reproducible assessment of the evolutionary algorithm's impact.  Buraya ne kullanarak dataset generate edildiği eklenmeli  2.4 Preliminary Studies  Kodlar bittikten sonra deneme amaçlı x müşteri için bi çalıştırdıysak onu yazacağız buraya.(Sanity Check)  2.1 Research DesignThis study employs a parallel comparative algorithmic research design to evaluate the effectiveness of a proposed evolutionary approach against a pre-established exact solver framework. The methodology is structured to independently execute two distinct pipelines, ensuring a controlled and objective validation of the proposed improvements.Baseline Establishment (Gurobi \+ RTS): In the initial phase, the Traveling Salesman Problem (TSP) sequence is solved using Gurobi, representing the absolute mathematical optimum for routing distances. This sequence is then fed into the Route-Transform-Shortest Path (RTS) heuristic to calculate the baseline operational makespan, serving as the objective benchmark. Proposed Evolutionary Model (GA \+ RTS): In parallel, a custom Genetic Algorithm (GA) is introduced to overcome the rigid routing limitations of the exact solver. The GA fundamentally alters the search mechanism by utilizing population-based evolutionary operators to generate visitation sequences. These sequences are subsequently evaluated through the same dynamic RTS heuristic. Both pipelines strictly adhere to identical mathematical constraints, including drone energy capacities (EMAX) and simultaneous launch limits ($k$). The core objective is to conduct a benchmark analysis measuring the percentage improvement in the total operational makespan ($T\_{max}$) achieved by the evolutionary model compared to the exact baseline. 2.2 VariablesIndependent VariablesProblem Scale Parameters:Number of Customers ($|C|$): Represents the total number of customer nodes (e.g., 25, 50, 100\) that the algorithm must process.Number of Drones ($k$): Indicates the maximum number of drones (ranging from 1 to 8\) that can be launched simultaneously from the truck at meeting points.GA Hyperparameters:Population Size: 150 to 250 alternative route solutions competing simultaneously in each generation.Generations: The maximum number of evolutionary iterations (400 to 800\) the algorithm processes before termination.Crossover Operator: Order Crossover (OX) is implemented to combine the genetic information of selected parent routes without violating strict single-visit constraints.Mutation Rate: Set at 10% (0.10). The probability of randomly swapping the positions of two customers (Swap Mutation) within a route to actively avoid getting trapped in local optima.Elitism Ratio: Set at 10% (0.10). Ensures that the top 10% of the fittest routes in the current generation are directly cloned into the next generation without undergoing mutation or crossover.Dependent VariablesTotal Operational Time ($T\_{max}$): The overarching objective function. It represents the total makespan required for the truck and drones to complete all package deliveries and return to the depot.Computational Execution Time: The physical CPU time measured from the algorithm's initialization until it outputs the final RTS schedule. This variable acts as a key indicator of algorithmic scalability.Improvement (%): Indicates the practical time-saving efficiency achieved by the Genetic Algorithm (GA) compared to the Gurobi-based baseline. Calculated using the following formula:Improvement (%) \= ((T\_max\_Gurobi \- T\_max\_GA) / T\_max\_Gurobi) \* 100 2.3 Data Collection & Statistical MethodsDue to the unavailability of the original benchmark instances from the reference literature, synthetic datasets were systematically generated strictly adhering to the instance generation procedures outlined in the original study. To simulate the operational environment, a 25 km x 25 km coordinate system was established. Within this continuous grid, customer locations ($C$) and the central depot ($v\_0$) were populated utilizing a uniform random distribution generated via custom Python scripts (using a fixed random seed of 42 to guarantee reproducibility). The generated data was formatted to match the standard Solomon VRPTW .txt structure. All travel times were computed using Euclidean distances divided by the respective constant velocities of the truck and drones.For the analytical evaluation phase, a pairwise comparison strategy is employed. Both the baseline Gurobi-RTS and the proposed GA-RTS are executed across identical synthetic instances (e.g., datasets scaled at 25, 50, and 100 customers). The primary statistical metric utilized to evaluate the algorithmic performance is the relative percentage improvement in the total operational time ($T\_{max}$). 2.4 Preliminary Studies (Sanity Check)Prior to executing large-scale simulations, preliminary feasibility tests (sanity checks) were conducted on small-scale subsets consisting of 10 customer nodes. The primary purpose of these initial runs was to empirically validate the robustness of the system's physical constraints. Specifically, these tests verified that the drone battery limit (EMAX) constraint effectively eliminated infeasible sub-routes. Furthermore, these preliminary studies confirmed the successful execution of the dynamic payload assignment logic, ensuring the algorithm correctly toggled between Quadrocopter and Octocopter energy consumption profiles based on combined package weights before scaling the algorithms to full 50-node and 100-node instances.  |
| :---- |

3. **PROJECT MANAGEMENT**

   1. **Work – Time Schedule**

The main work packages and objectives to be included in the research proposal, the time period in which each work package will be carried out, the success criteria and its contribution to the success of the research are given by filling out the "Work-Time Schedule". Literature review, development, and final report preparation stages, sharing of research results, article writing, and material procurement should not be shown as separate work packages.

As a criterion of success, it is explained which criteria each work package meets and will be considered successful. The success criterion is specified with quantitative or qualitative criteria (expression, number, percentage, etc.) in a way that is measurable and traceable.

**Work – Time Schedule (\*)**  
        

| Work No | Name and goals of the work | Responsible Student | Time Range (... \- ... Week) | Success Criteria and Contribution to the Success of the Project |
| ----- | ----- | :---: | :---: | :---: |
| 1 | Parameter Identification & Selection and Implementation of Genetic Algorithm as a Computational Tool | Melek Yiğit,  Defne Dilara Can,  Kudret Çatal | Week 5-8 | GA parameters are identified and justified. Algorithm is implemented and produces valid routing solutions. |
| 2 | Custom Data Generation  | Custom Data Generation | Week 9 | A realistic routing dataset is generated in the correct format and accepted by both solvers without errors |
| 3 | VisitOrder Establishment (Gurobi TSP) | Kudret Çatal | Week 10 | Gurobi MIP model correctly solves the TSP sub-problem and returns a valid, subtour-free visiting order. |
| 4 | Genetic Algorithm Development | Kudret Çatal,  Meriç Baş | Week 11 | GA consistently produces feasible visiting orders within acceptable time. Crossover and mutation operators are correctly implemented. |
| 5 | Web Application Development (FastAPI Backend & UI) | Meriç Baş | Week 11-12 | A fully functional web interface is built from scratch, no external CSS or JS frameworks used. Users can configure and run both algorithms, visualize routes on an interactive Leaflet.js map, switch between English and Turkish instantly, and view single-run or batch comparison reports with a live progress modal. All UI output is verified to correctly reflect backend data. |
| 6 | Benchmarking & Comparative Analysis | Meriç Baş, Sami Atalay Şerbet | Week 12-13 | Both algorithms are compared on identical datasets with real measurements. Test scenarios (BT, FT, ST) are designed and all pass. |

(\*) Rows and columns in the table can be expanded and duplicated as needed.

2. **Risk Management**

The risks that may negatively affect the success of the research and the measures to be taken to ensure the successful conduct of the research when these risks are encountered (Plan B) are outlined in the Risk Management Table below, specifying the relevant work packages. The implementation of Plan B should not lead to deviation from the main objectives of the research.

                                                       **RISK MANAGEMENT TABLE\***

| Work No | Major Risks  | Risk Management (Plan B) |
| ----- | ----- | ----- |
| 1 | Unavailability of the dataset in the original article. | Creating our own dataset |
| 2 | TEKNİK RİSK YAZILSIN |  |

(\*) Rows and columns in the table can be expanded and duplicated as needed.

3. **Research Opportunities**

In this section, the infrastructure/equipment (laboratory, vehicle, machinery-equipment, etc.) facilities that exist in the institutions and organizations where the project will be carried out and will be used in the project are specified.

**RESEARCH OPPORTUNITIES TABLE (\*)**

**Ana araçları ekledim,bunları yaptığınız yerin adını doğru şekilde girersiniz, başka kullandığını bir şey varsa ekleyebilirsiniz alta. Açıklamalar da tam doğru mu yazdıklarım kontrol eder misiniz?**

| Infrastructure/Equipment Type and Model in the Organization (Laboratory, Vehicle, Machinery-Equipment, etc.) | Purpose of Use in the Project |
| ----- | ----- |
| Dataset’in yapıldığı araç | Developed to replicate the technical parameters of Paper-10 (25x25 km area, heterogeneous weights) and ensure experimental reproducibility.  |
| Gurobi’nin yapıldığı araç (**Gurobi Optimizer** (Version 8.1.0 or latest) ? | Utilized as the primary commercial solver to establish the optimal Traveling Salesman Problem (TSP) baseline in Phase 1 (VisitOrder).  |
| GA ‘nın yapıldığı araç | The core programming language used to implement the RTS framework, the custom dataset generation script, and the Genetic Algorithm metaheuristic  |

(\*) Rows and columns in the table can be expanded and duplicated as needed.

4. **IMPLICATIONS \-SİZDE**

  If the proposed study is carried out successfully, the common effects expected to be obtained from the research, in other words, what outputs, results and effects will be obtained from the research are given in the table below.

**EXPECTED IMPLICATIONS TABLE of the RESEARCH**

| Implication Types | Expected Outputs, Results, Findings, and Impacts |
| ----- | ----- |
| **Scientific/Academic**  (Article, Paper, Book Chapter, Book) |  |
| **Economic/Commercial/Social** (Product, Prototype, Patent, Utility Model, Production Permit, Variety Registration, Spin-off/Start-up Company, Audiovisual Archive, Inventory/Database/Documentation Production, Copyrighted Work, Media Coverage, Fair, Project Market , Workshop, Training etc. Scientific Activity, Institution/Organization That Will Use Project Results, etc. Other common effects) |  |
| **Training Researchers and Creating New Project(s)**  (Master's/PhD Thesis, National/International New Project) |  |

5. **FINDINGS**

Detail the experiments conducted to assess and verify your methodology. Present the gathered data and results from the analysis. Conclude by providing an evaluation of the verification process, determining whether it was successful or unsuccessful.

6. **CONCLUSION**

Provide an overview of each stage of the project, focusing particularly on methodology, integration, and verification. Subsequently, present the outcomes of the verification experiments and discuss your conclusions. Conclude by reflecting on your achievements, setbacks, and insights gained from the project. Offer suggestions for potential future enhancements or developments of the project. 

With these elements in place, you are now ready to draft the Summary*.*

Metodoloji için conclusion: This project successfully designed and implemented an evolutionary optimization framework for the Multi-Visit Drone Routing Problem (k-MVDRP). Throughout the project lifecycle, the structural methodologies of Industrial Engineering–including mathematical constraint formulation and algorithmic hyperparameter tuning–were seamlessly integrated with Software/Computer Engineering development practices to build a  reliable and integrated computational program. Metodoloji \+ integration conclusion u gibi oldu. Hyperparameter tuningi pzt konuşuruz ona göre düzenleme ekleme çıkarma yaparım buraya da metodoloji bölümüne de  
Integration için conclusion:  
Verification için conclusion:

7. **APPENDICES**  
   1. **Sub-Teams**

The "Sub-Teams" part provides an in-depth overview of the design and construction efforts dedicated to individual teams of the project.

1.  **Industrial Engineering Team**   
   1. **Overview**

Commence with a brief introduction to the sub-team, highlighting their role within the project. Define the functional and performance prerequisites of your sub-system. Outline the tasks of your team must execute and the level of performance to meet the objectives of project requirements.

2. **Literature Survey**

Perform a comprehensive review of existing literature to explore technologies and methodologies dealing with your sub-system.

3. **Constraints**

A constraint refers to any factor that imposes limits on the choices you can make in your design. Identify and explore the primary constraints that must be taken into account for your project.

4. **Requirements**

Provide a concise summary covering functional requirements (the necessary tasks the project must accomplish) and performance requirements (the level of effectiveness the project must achieve in executing its tasks).

5. **Methodology**

Explain in detail the methods and research techniques applied in the research project dealing with your sub-system.

2. **Computer / Software Engineering Team**  
   1. **Overview**

Commence with a brief introduction to the sub-team, highlighting their role within the project. Define the functional and performance prerequisites of your sub-system. Outline the tasks of your team must execute and the level of performance to meet the objectives of project requirements.

2. **Literature Survey**

Perform a comprehensive review of existing literature to explore technologies and methodologies dealing with your sub-system.

3. **Constraints**

A constraint refers to any factor that imposes limits on the choices you can make in your design (technology, policy, regulation, performance constraint). Identify and explore the primary constraints that must be taken into account for your project.

4. **Requirements**

Provide a concise summary covering functional and non-functional requirements (the necessary tasks the project must accomplish) and performance requirements (the level of effectiveness the project must achieve in executing its tasks).

5. **Methodology**

Explain in detail the methods and research techniques applied in the research project dealing with your sub-system**.**

2. **System Integration**

Explain the integration of sub-systems to form the final project and assessing its functionalities and performance. It's crucial to conduct verification through well-structured experiments and thorough analysis of data. All sub-teams are required to contribute to this phase.

**APPX-1:  REFERENCES**

Use APA-style for references and citations. 

Aytaç Adali, E., Öztaş, G. Z., Öztaş, T., & Tuş, A. (2022). Assessment of European cities from a smartness perspective: An integrated grey MCDM approach. *Sustainable Cities and Society*, 84, 104021\. [https://doi.org/10.1016/j.scs.2022.104021](https://doi.org/10.1016/j.scs.2022.104021) 

Savaş, S., Cenani, Ş., & Çağdaş, G. (2021). Selection of Emergency Assembly Points: A Case Study for the Expected Istanbul Earthquake. In Y. I. Topcu, Ö. Özaydın, Ö. Kabak, & Ş. Önsel Ekici (Eds.), *Multiple Criteria Decision Making: Beyond the Information Age* (pp. 37–67). Springer International Publishing. [https://doi.org/10.1007/978-3-030-52406-7\_2](https://doi.org/10.1007/978-3-030-52406-7_2) 

Taherdoost, H., & Madanchian, M. (2023). Multi-Criteria Decision Making (MCDM) Methods and Concepts. *Encyclopedia*, 3(1), Article 1\. [https://doi.org/10.3390/encyclopedia3010006](https://doi.org/10.3390/encyclopedia3010006) 

Topcu, Y. I., Özaydın, Ö., Kabak, Ö., & Önsel Ekici, Ş. (Eds.). (2021). *Multiple Criteria Decision Making: Beyond the Information Age*. Springer International Publishing. [https://doi.org/10.1007/978-3-030-52406-7](https://doi.org/10.1007/978-3-030-52406-7) 

[image1]: <data:image/png;base64,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>