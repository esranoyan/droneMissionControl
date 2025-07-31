## 📁 **Bölüm 1: Veri Tabanı Tipleri ve Temelleri**

1. "Relational Database" nedir? Bu tür veritabanlarında veriler nasıl modellenir?
    
2. "NoSQL Database" nedir? Document, key-value, column ve graph tabanlı türlerini örneklerle karşılaştır.
    
3. Görev planlama sistemi gibi bir uygulamada hangi veri tiplerinin saklanacağını düşün: görev bilgisi, İHA konumu, kullanıcı bilgisi, geçmiş görevler, vb.  
    Bu verilerin her biri için SQL mi yoksa NoSQL mi tercih ederdin? Neden?
    
4. ACID ve BASE kavramlarını araştır. Bu kavramlar sistem davranışını nasıl etkiler?
    
5. Görevlerin İHA’lar ve kullanıcılarla ilişkili olduğunu varsay. Bu ilişkileri hangi veritabanı yapısıyla daha iyi kurarsın?  
    Document tabanlı yapıda bu ilişkiler nasıl ifade edilir? SQL’de nasıl?
    
6. Görev geçmişini kullanıcıya listelemek istiyoruz. Bu tür sorgularda SQL kullanmak mı avantajlı olurdu, yoksa başka bir yapı mı? Neden?
    
7. İHA’lar görev sırasında sürekli konum verisi gönderiyor. Bu yoğun ve zamana duyarlı veriler için hangi veritabanı tipi daha uygundur?
    
8. Görev verisini tek bir JSON nesnesinde saklamak mı yoksa tablo-tablo ayırarak mı saklamak daha uzun ömürlü olur?  
    Sistemde sık güncelleme veya esneklik ihtiyacı varsa bu karar nasıl etkilenir?
    
9. ACID kavramını araştır. Her görev değişikliği anında veritabanına yansıtılıyor ama bu sistemin yavaşlamasına neden oluyor. Bu sorunu çözmek için neler yapabilirsin?
    
10. "Polyglot Persistence" kavramını araştır. Sistem hem relational hem de document veri tutuyorsa bu ayrımı nasıl yapardın?  
    Hangi verileri SQL'de, hangilerini NoSQL'de saklamak daha anlamlı olur?
    
11. Arayüzde görev bilgisiyle birlikte son konum da gösteriliyor. Bu iki veri farklı yapılarda tutuluyorsa, backend tarafında nasıl bir çözüm kurardın?


## 📁  **Bölüm 2: CAP Teoremi ve Veri Tutarlılığı**

1. CAP teoremi nedir? "Consistency", "Availability" ve "Partition Tolerance" kavramlarını açıklayarak örneklerle açıkla.
    
2. CAP üçlemesinde neden aynı anda üçünü birden garanti edemeyiz?
    
3. Görev planlama sistemini düşün. Birden fazla istemci aynı anda görev oluşturabiliyor ve güncelleyebiliyor.  
    Bu durumda "consistency" mi yoksa "availability" mi daha kritik? Neden?
    
4. Dağıtık bir sistemde görev verileri farklı bölgelerdeki sunucularda tutuluyorsa, bu durumda CAP üçlemesinden hangisi daha öncelikli olurdu?
    
5. Bir sistemde "Partition Tolerance" vazgeçilmezdir deniyor. Bu ne anlama gelir?  
    Sistemin bu özelliğe sahip olması ne tür durumlarda önemlidir?
    
6. CAP teoremine göre "AP" tercih eden bir sistem nasıl davranır? Böyle bir davranışın görev planlama sistemindeki olası avantaj ve dezavantajları nelerdir?
    
7. Görevleri atayan kullanıcının yaptığı değişikliklerin anında diğer kullanıcılara da yansıması gerekiyorsa sistemin hangi CAP yönünü önceliklendirmesi gerekir?
    
8. CAP teoremine göre "CP" tercih eden bir sistemde partition durumunda sistem nasıl davranır?  
    Bu durum kullanıcı deneyimini nasıl etkiler?
    
9. Sistem geçici olarak ağ bağlantısını kaybederse (partition oluşursa) görev kaydının kaybolmaması için nasıl bir strateji izlersin?
    
10. CAP teoremine uygun sistem davranışını belirlemek için görev planlama sisteminde karşılaşılabilecek bir senaryoyu baştan sona sen kurgula.  
    Olası bir partition durumunu, ne tür kararlar alacağını, hangi özelliği önceliklendireceğini yazılı olarak açıkla.  

## 📁 **Bölüm 3: Genel Backend Prensipleri**

1. "REST" kavramını araştır. Bir REST API nasıl çalışır? CRUD işlemleri REST içinde nasıl temsil edilir?
    
2. "MVC" ve "service-repository" tasarım desenlerini araştır. Backend projelerinde bu yapılar neden tercih edilir?
    
3. "Stateless" ve "stateful" servisler arasındaki fark nedir?  
    Görev planlama sisteminde backend’in stateless olması ne gibi avantajlar sağlar?
    
4. Asenkron programlama nedir? Hangi durumlarda tercih edilir?  
    Görev güncellemeleri veya konum bildirimleri asenkron yapılmalı mı? Neden?
    
5. Backend geliştirirken veritabanı ile doğrudan bağlantı yerine araya servis ve repository katmanları koymak neden önemlidir?
    
6. Backend servislerinin birbirinden ayrılmasının (separation of concerns) uzun vadede ne gibi etkileri olur?
    
7. API endpoint’lerini tasarlarken nelere dikkat etmelisin? Görev oluşturma, güncelleme ve silme için örnek endpoint URL’leri yaz.
    
8. Görev güncelleme API’si çağrıldığında, görev verisi hem frontend’e hem de başka sistemlere gitmeli.  
    Bu durumda backend nasıl yapılandırılmalı?
    
9. Backend’de loglama, hata yönetimi ve validasyon neden önemlidir?  
    Görev atama sürecinde yapılan bir hatanın loglanmaması ne gibi sorunlara yol açar?
    
10. Kullanıcı yetkilendirmesi yapılmalı. Backend tarafında görevleri sadece kendi İHA’ları için görebilmeleri nasıl sağlanır?  
    Bu yetkilendirme için token tabanlı bir çözüm önerisi getir.
    
11. Backend’in frontend’e veri döndürürken hangi yapıyı kullanması daha sağlıklı olur?  
    DTO (Data Transfer Object) nedir, neden kullanılır?
    
12. Bir API tasarımı yap. `GET /gorevler` ve `POST /gorev` endpoint’lerinin alacağı parametreleri ve örnek response yapısını JSON formatında yaz.  

## 📁 **Bölüm 4: Dağıtık Sistemler ve Deployment**

1. "Monolith" ve "microservice" mimarilerini araştır. Temel farkları nelerdir?
    
2. Görev planlama sistemini monolith mi yoksa microservice olarak mı tasarlardın? Hangi durumda hangisi daha uygun olur?
    
3. Microservice mimaride servislerin birbirleriyle nasıl haberleştiğini araştır. Synchronous ve asynchronous iletişim farkları nedir?
    
4. Uygulamayı Docker ile container olarak çalıştırmak neden önemlidir?  
    Container kullanmanın geliştirici, test ve prod ortamlarına etkisi nedir?
    
5. Birden fazla servisi yönetmek için "Kubernetes" gibi bir orkestrasyon sistemi neden gereklidir?
    
6. CI/CD kavramını araştır. Sürekli entegrasyon ve sürekli dağıtım süreçleri backend geliştirme açısından neden kritiktir?
    
7. IHA görev planlama sistemini bir staging ortamına deploy etmek istiyorsun. Bu süreçte hangi adımları takip edersin?
    
8. Konteyner tabanlı sistemlerde her servisi ayrı bir container olarak mı çalıştırmak gerekir? Ne gibi avantaj ve dezavantajlar olur?
    
9. Uygulamayı production ortamına taşıdığında log takibi, hata ayıklama ve güncelleme süreçlerini nasıl planlarsın?
    
10. Microservice yapıda görev servisi çökerse diğer servisler nasıl etkilenir? Bu tür senaryoları yönetebilmek için nasıl bir yapı kurarsın?
    
11. Backend servislerinden biri versiyon güncellemesi alacak. Sistemi durdurmadan bu güncellemeyi nasıl yaparsın?
    
12. Deployment sonrası sistemin çalıştığını nasıl doğrularsın? Otomatik testlerin burada yeri nedir?
    
13. Versiyonlama (v1, v2 gibi) neden önemlidir? API versiyonlama yapılmadığında ne tür sorunlar yaşanabilir?
    
14. Son olarak, görev planlama sistemini üretime alırken minimum kesintiyle, güvenli bir şekilde nasıl bir dağıtım stratejisi izlersin?  
    Blue-green deployment, canary release gibi stratejilerden hangisi uygun olurdu?  


## 📁 **Bölüm 5: Load Balancing ve Ölçeklenebilirlik**

1. "Load balancing" nedir? Hangi durumlarda sistemin performansını artırmak için kullanılır?
    
2. Donanımsal (hardware) ve yazılımsal (software) load balancer farklarını araştır.  
    Modern web sistemlerinde hangisi daha yaygın kullanılır, neden?
    
3. Horizontal ve vertical scaling kavramlarını araştır. İki yaklaşımın farkı nedir?  
    Görev planlama sisteminde hangisi daha uygulanabilir olurdu?
    
4. Backend sunucularına gelen istekleri eşit dağıtmak için nasıl bir yapı kurarsın?
    
5. Anlık olarak 1000 İHA'nın görev durumu güncellemeleri gönderdiği bir senaryoda sistem nasıl tepki verir?  
    Darboğaz nerede oluşabilir?
    
6. Load balancer'ın arkada hangi kriterlere göre yönlendirme yaptığını araştır. Örneğin round-robin, IP hash gibi yöntemler nasıl çalışır?
    
7. Görev planlama sistemi sadece belirli zamanlarda yoğunluk yaşıyor (örneğin sabah 9’da). Bu durumda sistemi ölçeklemek için nasıl bir strateji izlersin?
    
8. Sunuculardan biri çökerse, yük dengeleme sistemi bunu nasıl fark eder ve nasıl tepki verir?
    
9. Load balancer'ı kullanırken kullanıcı oturum yönetimi (session) nasıl etkilenir? Sticky session nedir?
    
10. Cache (önbellekleme) sistemleri load üzerindeki etkisi nedir? Hangi verileri cache’lemek mantıklıdır?
    
11. Load balancing sisteminin kendisi de tekil bir sunucu ise, bu sistemin çökmesi tüm yapıyı etkiler. Bu problemi nasıl çözersin?
    
12. IHA’lara görev atamaları yüksek trafikte gecikiyorsa, bu gecikmeyi azaltmak için backend mimarisinde neleri değiştirirdin?
    
13. Auto-scaling nedir? Hangi metriklere göre tetiklenebilir? Görev planlama sistemine nasıl entegre edersin?
    
14. Yoğun trafiğe karşı sadece backend’i değil, veritabanını da ölçeklemek gerekir mi? Eğer evetse nasıl?  

## 📁 **Bölüm 6: Gerçek Zamanlı Veri İşleme**


1. "Gerçek zamanlı veri işleme" nedir? Hangi uygulamalarda kritik öneme sahiptir?
    
2. WebSocket, Server-Sent Events (SSE), MQTT ve gRPC gibi protokolleri araştır.  
    Hangisi hangi durumda daha uygun olur?
    
3. İHA'lar konum bilgilerini her 2 saniyede bir gönderiyor. Bu verileri gerçek zamanlı olarak kullanıcıya iletmek için hangi teknolojiyi seçerdin? Neden?
    
4. REST API ile gerçek zamanlı veri iletimi mümkün müdür? Neden genelde tercih edilmez?
    
5. WebSocket kullanıldığında bağlantı sürekli açık kalır. Bu yaklaşımın avantajları ve sınırlamaları nelerdir?
    
6. Gerçek zamanlı sistemlerde mesaj kaybı nasıl önlenir? Uçtan uca güvenilir bir yapı nasıl kurulur?
    
7. "Event-driven architecture" nedir? Gerçek zamanlı görev güncellemeleri bu yapıda nasıl ele alınır?
    
8. Pub/Sub modelini araştır. Bu yapıyı İHA görev bildirimlerinde nasıl kullanabilirsin?
    
9. Görev planlama sistemi, birden fazla kullanıcıya aynı anda güncel görev bilgilerini iletmek zorunda.  
    Bu senaryoda sistemin mimarisi nasıl olmalı?
    
10. Gerçek zamanlı veri işleyen sistemlerde zaman senkronizasyonu neden önemlidir?  
    İHA’ların gönderdiği veriler arasında zaman farkı oluşursa ne gibi problemler doğar?
    
11. Kullanıcı internet bağlantısını kaybedip tekrar bağlandığında, aradaki verileri nasıl tamamlamalısın?
    
12. Gerçek zamanlı mesajların işlenme sırası önemliyse (örneğin konum güncellemeleri), bu sırayı nasıl korursun?
    
13. Gerçek zamanlı bir görev değişikliği, tüm istemcilerde anında görünmelidir.  
    Backend sisteminde bu senaryoyu nasıl kurgularsın?
    
14. Sistem yüksek trafik altında yavaşlamaya başlarsa, gerçek zamanlı veri iletimi gecikir. Bu durumda ne tür çözümler uygulanabilir?  

## 📁 **Bölüm 7: Frontend ile Backend Arasındaki Katmanlar ve İletişim**

1. Frontend ile backend arasındaki katmanları araştır. API Gateway, BFF (Backend for Frontend), proxy sunucu gibi yapılar ne işe yarar?
    
2. Görev planlama sisteminde frontend doğrudan backend’e mi istek göndermeli, yoksa araya bir katman koymalı mıyız? Neden?
    
3. API Gateway kullandığında sistem güvenlik, loglama ve yönlendirme açısından nasıl avantajlar sağlar?
    
4. "DTO" (Data Transfer Object) nedir? Frontend ile backend arasında veri taşırken neden kullanılır?
    
5. Kullanıcı giriş yaptıktan sonra görev verilerini çekmek istiyor. Bu isteklerde hangi kimlik doğrulama (authentication) ve yetkilendirme (authorization) yapıları kullanılabilir?
    
6. JWT nedir? Frontend ve backend arasında nasıl çalışır?
    
7. Birden fazla frontend istemcisi varsa (web, mobil vs.), backend bunlara özelleştirilmiş veri dönmeli midir? Bunu nasıl sağlarsın?
    
8. WebSocket bağlantısı kuran istemcilerin her biri sadece kendi İHA’larına ait verileri görebilmeli.  
    Bu ayrımı backend tarafında nasıl yaparsın?
    
9. Frontend ile backend farklı domainlerde çalışıyorsa CORS problemiyle karşılaşılır.  
    CORS nedir, nasıl çözülür?
    
10. Arayüzde kullanıcı sadece kendine atanmış görevleri görmeli. Bu filtreleme backend'de mi yapılmalı, frontend’de mi? Neden?
    
11. Frontend’in, backend’e çok sık istek atması sistemde ne gibi yükler oluşturur?  
    Bunu azaltmak için hangi stratejileri uygularsın?
    
12. Backend’le iletişimde HTTP dışında hangi protokoller kullanılabilir? Görev planlama sisteminde alternatif bir protokol kullanmak ister miydin?
    
13. Görev detaylarını frontend’e dönerken bazı verileri (örneğin hassas ID’ler, sistem bilgileri) göstermek istemiyoruz.  
    Bu filtrelemeyi nerede ve nasıl yapmalısın?
    
14. Frontend ile backend arasında oluşabilecek veri uyumsuzluklarını önlemek için ne tür önlemler alırsın?  
    (örneğin, güncel olmayan görev bilgisi, eksik alanlar, vb.)  

## 📁 **Bölüm 8: Mimari Tasarım Desenleri**


1. "Clean Architecture", "Hexagonal Architecture", "Layered Architecture" gibi yazılım mimarilerini araştır.  
    Aralarındaki temel farkları ve hangi durumlara uygun olduklarını özetle.
    
2. Görev planlama sistemine en uygun mimariyi seçmek istesen hangisini seçerdin? Seçiminin gerekçesini yaz.
    
3. "Domain Driven Design (DDD)" nedir? "Entity", "Value Object", "Aggregate", "Repository" gibi kavramları öğren.
    
4. Görev planlama sisteminde "görev", "kullanıcı" ve "İHA" kavramları DDD’ye göre hangi rollere girer?  
    (Entity mi, Value Object mi vs.)
    
5. "CQRS" (Command Query Responsibility Segregation) nedir?  
    Bu desenin avantajlarını ve dezavantajlarını gerçek bir senaryo üzerinden açıklamaya çalış.
    
6. Görev bilgisi güncellenirken bir servis, görev bilgisi görüntülenirken başka bir servis kullanılabilir mi?  
    CQRS kullanarak böyle bir yapı nasıl kurulur?
    
7. "Event Sourcing" nedir? Bu yaklaşımda sistemin geçmiş durumu nasıl yeniden oluşturulur?
    
8. Görev planlama sisteminde görev geçmişini saklamak istiyoruz. Event sourcing burada işe yarar mı?  
    Kullanırsan ne gibi fayda veya karmaşıklık olur?
    
9. Bir değişiklik olduğunda sistemin farklı parçalarının bu değişiklikten haberdar olması gerekiyor.  
    Bu durum için hangi mimari deseni uygularsın?
    
10. DDD’ye göre, görev atama işlemi bir “use case” midir? Uygulama servisi içinde nasıl modellenir?
    
11. Mimari desenlerin birçoğu katmanlara ayrılmış yapılar önerir. Bu katmanlar neden ayrılır ve aralarında nasıl veri geçişi olur?
    
12. Hexagonal Architecture'da "port" ve "adapter" nedir? Bu kavramları görev planlama örneğiyle açıklamaya çalış.
    
13. Seçtiğin mimaride, frontend ve veritabanı katmanları ile doğrudan bağlantıyı nerede ve nasıl kesersin?  
    Bağımlılıkların yönü neden önemlidir?
    
14. Son olarak, daha önce yaptığın frontend uygulamasını düşündüğünde, şimdi öğrendiğin bu mimari yapıların hangisini oraya entegre etmeyi isterdin? Neden?  

## 📁 **Bölüm 9: Robust Gerçek Zamanlı Sistemler İçin Mimari**

1. "Robust system" kavramını araştır. Bir sistemin dayanıklı (robust) olması ne anlama gelir?
    
2. Gerçek zamanlı sistemlerde sık karşılaşılan hata türleri nelerdir? Bu hatalara karşı sistem nasıl davranmalıdır?
    
3. "Retry", "timeout", "circuit breaker" gibi hata yönetim desenlerini araştır. Ne işe yararlar?  
    Hangi durumlarda kullanılırlar?
    
4. Görev ataması sırasında backend’de bir hata oluştu. Bu hatayı frontend’e nasıl iletirsin ve kullanıcı deneyimi nasıl etkilenir?
    
5. Sistemin aşırı yük altına girmemesi için "rate limiting" uygulanmalı mı? Hangi senaryolarda gereklidir?
    
6. Ani bir trafik artışı olduğunda sistemin çökmemesi için neler yapabilirsin?  
    Hangi mimari önlemler alınmalı?
    
7. Gerçek zamanlı konum verisi gönderiminde bazı mesajlar kaybolabiliyor. Bu durumda kullanıcıya ne göstermelisin?  
    Veri eksikliği nasıl anlaşılır?
    
8. "Graceful degradation" nedir? Sistem tam performansla çalışamasa bile kullanıcının temel işlevleri kullanabilmesi nasıl sağlanır?
    
9. "Observability" nedir? Monitoring, logging ve alerting sistemleri neden gereklidir?
    
10. Prometheus, Grafana gibi araçları araştır. Görev planlama sisteminde bu araçları nasıl kullanabilirsin?
    
11. Hataları loglamak tek başına yeterli midir?  
    Hataların sistem sağlığına etkisini değerlendirebilmek için hangi verileri toplamalısın?
    
12. Sistemde oluşan hataların tekrar etmemesi için loglardan elde edilen verilerle nasıl bir iyileştirme süreci planlarsın?
    
13. Kullanıcıların gerçek zamanlı veri görmesi için WebSocket kullanılıyor.  
    WebSocket bağlantısı koptuğunda ne olur? Sistemin bunu fark etmesi ve müdahale etmesi nasıl sağlanır?
    
14. Son olarak, görev planlama sisteminde sağlamlık (robustness) için uygulayacağın en az 3 önlemi detaylı şekilde yaz.  
    (Örneğin: zaman aşımı kontrolleri, mesaj kuyruğu, health check endpoint'leri vb.)  

## 📁 **Bölüm 10: Askeri Sistemler İçin Sistem Tasarımı**

1. Askeri sistemlerin yazılım mimarisi sivil sistemlerden nasıl farklıdır? Bu farkların nedenlerini araştır.
    
2. Güvenlik açısından askeri bir yazılım sistemi hangi özelliklere sahip olmalıdır?  
    (örnek: kimlik doğrulama, veri şifreleme, erişim kontrolü vs.)
    
3. TLS, veri şifreleme, hashing gibi güvenlik yaklaşımlarını araştır. Hangi veriler hangi yöntemlerle korunmalı?
    
4. Görev planlama sistemi offline çalışmak zorunda kalabilir. Böyle bir durumda nasıl bir mimari önerirsin?
    
5. Offline çalışma sırasında toplanan verilerin yeniden senkronizasyonu nasıl yapılmalı?  
    Veri bütünlüğü nasıl korunur?
    
6. Askeri senaryolarda sistemin güvenliğini artırmak için ağ seviyesinde alınabilecek önlemler nelerdir?
    
7. Yazılım sistemine fiziksel erişim sağlanırsa ne gibi riskler oluşur?  
    Bu durumlara karşı nasıl savunmalar inşa edebilirsin?
    
8. Redundancy (yedeklilik) nedir? Görev kontrol sistemi için hangi parçalar redundant çalışmalı?
    
9. Fault-tolerance (hata toleransı) nedir? Görev sisteminde hangi tür hatalar toleranslı şekilde yönetilmeli?
    
10. Görev verilerinin bazıları çok hassas olabilir (örneğin uçuş planları). Bu veriler sistemde nasıl saklanmalı ve erişimi nasıl sınırlandırılmalı?
    
11. Askeri bir yazılım sisteminde "loglama" nasıl yapılmalıdır? Tüm loglar tutulmalı mı, kısıtlanmalı mı?
    
12. Sistem güncellemeleri uzaktan yapılmalı mı? Yapılacaksa nasıl güvenli bir güncelleme altyapısı kurarsın?
    
13. Görev planlama sistemi herhangi bir zaman dış dünyadan izole (air-gapped) çalışabilir.  
    Bu durum için sistem tasarımında ne gibi değişiklikler gerekir?
    
14. Son olarak, görev planlama sistemini askeri kullanım için yeniden tasarlarken 3 temel önceliğini yaz.  
    Bu öncelikler doğrultusunda sistemin hangi parçalarını değiştirmek veya yeniden ele almak gerekir?  

## **Bonus Bölüm: Simüle Sistem Tasarımı**

**Konu:**  
Zaman damgalı konum ve irtifa (yükseklik) bilgisi üreten bir unsur simülatörü yaz.  
Bu simülatörden gelen verileri backend'de al, veritabanına kaydet ve eş zamanlı olarak frontend'e gönder.

**Zorunlu Bileşenler:**

- Sonsuz döngüde çalışan en az bir unsur (örneğin İHA), düzenli aralıklarla (örn. 1 sn) konum ve yükseklik verisi üretmeli.
    
- Üretilen her veri bir timestamp (zaman damgası) içermeli.
    
- Backend bu verileri almalı ve hem veritabanına kaydetmeli hem de frontend'e anlık olarak göndermeli.
    
- Frontend'de unsurun harita üzerinde konumu canlı olarak görünmeli ve sürekli güncellenmeli.
    

**Opsiyonel Özellikler:**

- Aynı anda birden fazla simülasyon üreteci çalıştırılabilmeli.  
    Her yeni üretici, haritada yeni bir unsur olarak belirmeli ve bağımsız hareket etmeli.
    
- Frontend’de "Dışa Aktar" butonu olmalı. Bu butona basılınca:
    
    - Kullanıcıdan hangi unsur(lar)ın, hangi tarih aralığında dışa aktarılacağı seçilmeli.
        
    - Seçime uygun veriler backend’den çekilip bir dosya (CSV, JSON, vb.) olarak istemciye indirilmelidir.
        

**Dikkat Etmen Gereken Sorular:**

1. Konum simülatörü nasıl bir yapı kullanmalı?
    
    - Ayrı bir process mi, thread mi, yoksa backend'in bir parçası mı olmalı?
        
2. Backend’e gelen veriler gerçek zamanlı işlenmeli. Hangi protokol kullanırsın?  
    REST, WebSocket, MQTT, başka bir çözüm?
    
3. Gerçek zamanlı frontend güncellemeleri için hangi yapı uygundur?  
    Polling mi, WebSocket mi?
    
4. Backend ile veritabanı arasında bu yoğun veri trafiğinde performans kaybı yaşamamak için neler yaparsın?
    
5. Veritabanına gelen her konum verisini ayrı ayrı mı kaydedersin? Yoksa batch olarak mı işlemeyi düşünürsün?  
    Kararın neden?
    
6. Her unsurun verileri aynı tabloda mı tutulmalı, ayrı tablolar mı olmalı?  
    Tasarımını nasıl yaparsın?
    
7. Simülatör her unsur için benzersiz bir ID üretmeli mi? Eğer evet, nasıl?
    
8. Haritada her unsurun hareketi anlık görünmeli. Frontend tarafında bu hareketi nasıl çizdirirsin?
    
9. Dışa aktar özelliği için frontend ile backend arasında nasıl bir protokol ve veri yapısı kullanırsın?
    
10. Dosya dışa aktarımında büyük veri olursa performans nasıl etkilenir?  
    Backend’i nasıl optimize edersin?
    
11. Aynı anda 5 farklı unsur veri üretirken sistemin darboğazı nerede oluşabilir?  
    Buna karşı nasıl ölçekleme yaparsın?
    
12. Bu sistem askeri koşullarda offline çalışmak zorunda kalsa nasıl bir senkronizasyon stratejisi uygularsın?
    
13. Gerçek zamanlı veri akışı sırasında bir bağlantı kesilirse (örneğin WebSocket), sistem bu durumu nasıl fark eder ve toparlar?
    
14. Son olarak: Bu sistemin tüm bileşenlerini (simülatör, backend, veritabanı, frontend) içeren genel bir mimari tasarım çiz.  
    Bileşenlerin birbiriyle nasıl iletişim kurduğunu, hangi veri nerede tutulduğunu açıklayan bir şema hazırla.