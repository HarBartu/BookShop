# BookShop
## T120B165 Saityno taikomųjų programų projektavimas
### Projekto „Egzaminavimo sistema“ ataskaita
Studentas: Haroldas Bartusevičius, IFF-0/2

Dėstytojai: Tomas Blažauskas, Kiudys Eligijus

KAUNAS 2023

### Sistemos paskirtis
Projekto tikslas – sukurti knygų pardavimo platformą.
Veikimo principas – pačią kuriamą platformą sudarys dvi posistemės. Viena bus vartotojo, kuris perka knygas, peržiūri savo užsakymus. Kita pardavėjo sistema, kuri suteikia galimybę, kurti knygas, jų rinkinius ir jas pardavinėti sistemoje.
Pardavėjas užsiregistruos į platformą. Sukurs knygas, iš jų sudarys rinkinius, nustatys jų kainas. Pirkėjai galės knygas peržiūrėti, sudaryti užsakymą ir jas nusipirkti. Pardavimo platforma veikia ir kaip darbuotojų įrankis - pardavėjai, toje pačioje sąsajoje gali pridėti ir redaguoti prekes, o pirkėjas iškarto pirkti.

### Funkciniai reikalavimai

#### Neregistruotas sistemos naudotojas galės:

- Peržiūrėti platformos pagrindinį puslapį.
- Peržiūrėti kolekcijas ir jų sąrašą
- Peržiūrėti knygas ir jų sąrašą
- Užsiregistruoti sistemoje
  
#### Registruotas sistemos naudotojas galės:

- Peržiūrėti platformos pagrindinį puslapį.
- Peržiūrėti kolekcijas ir jų sąrašą
- Peržiūrėti knygas ir jų sąrašą
- Prisijungti prie sistemos
- Atsijungti nuo sistemos
- Peržiūrėti užsakymus ir jų sąrašą
- Kurti užsakymus
- Pridėti ir šalinti kolekcijas iš užsakymų

#### Pardavėjas galės:

- Peržiūrėti platformos pagrindinį puslapį.
- Peržiūrėti kolekcijas ir jų sąrašą
- Peržiūrėti knygas ir jų sąrašą
- Prisijungti prie sistemos
- Atsijungti nuo sistemos
- Peržiūrėti užsakymų sąrašą
- Kurti naujas kolekcijas
- Šalinti kolekcijas
- Redaguoti kolekcijas
- Pridėti knygų į kolekciją
- Šalintas knygas iš kolekcijos
- Redaguoti knygas

#### Administratorius galės:

- Peržiūrėti platformos pagrindinį puslapį.
- Peržiūrėti kolekcijas ir jų sąrašą
- Peržiūrėti knygas ir jų sąrašą
- Prisijungti prie sistemos
- Atsijungti nuo sistemos
- Peržiūrėti užsakymų sąrašą
- Kurti naujas kolekcijas
- Šalinti kolekcijas
- Redaguoti kolekcijas
- Pridėti knygų į kolekciją
- Šalintas knygas iš kolekcijos
- Redaguoti knygas
- Peržiūrėti užsakymus ir jų sąrašą
- Kurti užsakymus
- Pridėti ir šalinti kolekcijas iš užsakymų
- Redaguoti užsakymus
- Šalinti užsakymus

Sistemos sudedamosios dalys:

•	Kliento pusė (ang. Front-End) – naudojant React.js;
•	Serverio pusė (angl. Back-End) – naudojant Express.js. Duomenų bazė – PostgreSQL.

![image](https://github.com/HarBartu/BookShop/assets/109585255/46957113-b5f7-40e2-8ffb-50b0bdb8d533)

Visos sistemos dalys talpinamos Azure serveryje, atskiros dalys tarpusavyje bendrauja HTTP protokolu. Duomenų bazė su serveriu - TCP/IP protokolu.

# Projekto API Specifikacija

API, skirta valdyti kolekcijas, knygas ir užsakymus.

## Registracija ir Prisijungimas

### Registracija

- **URL:** `/register`
- **Metodas:** `POST`
- **Pavyzdys:**

```json
{
  "name": "Vartotojo Vardas",
  "role": "User",
  "email": "vartotojas@example.com",
  "password": "slaptazodis123"
}

```
### Prisijungimas

- **URL:** `/login`
- **Metodas:** `POST`
- **Pavyzdys:**

```json
{
"email": "vartotojas@example.com",
"password": "slaptazodis123"
}

```
## Kolekcijų Valdymas

### Gauti visas kolekcijas

- **URL:** `/collections`
- **Metodas:** `GET`

### Pridėti naują kolekciją

- **URL:** `/collections`
- **Metodas:** `POST`
- **Autorizacija:** Reikalinga (Admin, Seller)
- **Pavyzdys:**

```json
{
"name": "Fantastinės Knygos",
"price": 29.99
}

```
### Redaguoti kolekciją

- **URL:** `/collections/:id`
- **Metodas:** `PUT`
- **Autorizacija:** Reikalinga (Admin, Seller)
- **Pavyzdys:**

```json
{
"name": "Naujas Pavadinimas",
"price": 39.99
}

```
### Ištrinti kolekciją

- **URL:** `/collections/:id`
- **Metodas:** `DELETE`
- **Autorizacija:** Reikalinga (Admin, Seller)

## Knygų Valdymas

### Pridėti naują knygą

- **URL:** `/collections/:collectionId/books`
- **Metodas:** `POST`
- **Autorizacija:** Reikalinga (Admin, Seller)
- **Pavyzdys:**

```json
{
"name": "Kelionė per laiką",
"price": 12.99,
"description": "Fantastinė nuotykio knyga."
}
```
### Redaguoti knygą

- **URL:** `/collections/:collectionId/books/:bookId`
- **Metodas:** `PUT`
- **Autorizacija:** Reikalinga (Admin, Seller)
- **Pavyzdys:**

```json
{
"name": "Naujas Pavadinimas",
"price": 14.99,
"description": "Atnaujinta knygos aprašymo informacija."
}

```
### Ištrinti knygą

- **URL:** `/collections/:collectionId/books/:bookId`
- **Metodas:** `DELETE`
- **Autorizacija:** Reikalinga (Admin, Seller)

## Užsakymų Valdymas

### Gauti visus užsakymus

- URL: /orders
- Metodas: GET
- Autorizacija: Reikalinga (Admin, Seller, User)

### Pridėti naują užsakymą

- URL: /orders
- Metodas: POST
- Autorizacija: Reikalinga (Admin, User)
- Pavyzdys:

```json
{
  "date": "2024-01-17T22:00:00.000Z",
  "totalCost": 59.99
}

```
### Gauti užsakymo informaciją

- URL: /orders/:orderId
- Metodas: GET
- Autorizacija: Reikalinga (Admin, User)

### Redaguoti užsakymą

- URL: /orders/:id
- Metodas: PUT
- Autorizacija: Reikalinga (Admin)
- Pavyzdys:

```json
{
  "userId": 123,
  "date": "2024-01-17T22:00:00.000Z",
  "totalCost": 69.99
}

```
### Ištrinti užsakymą

- URL: /orders/:id
- Metodas: DELETE
- Autorizacija: Reikalinga (Admin)

### Pridėti kolekciją į užsakymą

- URL: /orders/:orderId/collections/:collectionId
- Metodas: POST
- Autorizacija: Reikalinga (Admin, User)

### Pašalinti kolekciją iš užsakymo

- URL: /orders/:orderId/collections/:collectionId
- Metodas: DELETE
- Autorizacija: Reikalinga (Admin, User)

## Naudotojo sąsaja

Pagrindinis puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/8a7ef861-ca5c-4093-9a9e-725b9c607143)

Prisijungimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/c3996e54-7d77-4853-9fc0-1b01cd7965f4)

Registracijos puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/1d92fe05-3fdf-4c14-9c92-df741b41d3b6)

Kolekcijų sąrašo puslapis (Prisijungusio varotojo perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/09522f60-77f2-4717-b630-427bbcb2272d)

Kolekcijos detelių puslapis (Prisijungusio vartotojo perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/86c248f5-337a-4438-bf49-72a811e0d7a7)

Knygos detalių puslapis 
![image](https://github.com/HarBartu/BookShop/assets/109585255/23b14ff5-8228-4138-baaf-24708d5c60b1)

Užsakymų puslapis (Prisijungusio vartotojo perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/6a91489a-93b0-411b-8f21-3a46dd2e2e48)

Užsakymo detalių puslapis (Prisijungusio vartotojo perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/1a1e00a5-58b2-410a-bc73-b976dea4f01b)

Kolekcijų sąrašo puslapis (Administratoriaus perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/00974424-e995-42d0-977e-3310c15e3b4c)

Naujos kolekcijos pridėjimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/8c160000-3582-49df-bc88-c92073feaeb8)

Kolekcijos redagavimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/3a14b414-3637-4531-b32c-8420c559540e)

Kolekcijos detalių puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/e40c12e3-912f-4d59-94cc-1cb0fdb6b625)

Knygos redagavimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/54006200-ff9e-40a3-aed6-320ca8ffdf87)

Naujos knygos pridėjimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/29ff8852-dd44-42f8-b405-18f6268cf81e)

Užsakymų sąrašo puslapis (Administratoriaus perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/a0a7eda8-a405-4a94-87be-44d344589ac2)

Užsakymo redagavimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/c36ab3eb-0529-431f-9fb4-dd47ae4e9341)

Naujo užsakymo pridėjimo puslapis
![image](https://github.com/HarBartu/BookShop/assets/109585255/8363e8ce-e6d7-40d7-a575-d5dadf5ad22a)

Kolekcijų sąrašo puslapis (Pardavėjo perspektyva)
![image](https://github.com/HarBartu/BookShop/assets/109585255/265ed3cc-56cf-46bb-b7b2-032aa4f3db83)

### Išvados
Šiame projekte buvo realizuota sistema skirta administruoti ir pardavinėti knygų rinkinius. Sistemoje naudotasi REST principais ir JWT autorizacija.
Projektas buvo sukurtas pasinaudontas Express.js ir React.js karkasais.
