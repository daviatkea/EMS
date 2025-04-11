# Frontend-eksamensprojekt

## TL;DR

I skal lave et Event Management System for en kurator fra Statens Museum for Kunst (SMK). I skal lave en frontend, der gør det muligt for kuratoren at oprette nye events, samt rette og slette eksisterende.

Foruden en titel, beskrivelse, dato og lokation, indeholder et event en samling af kunstværker fra SMK som kuratoren selv vælger. Jeres opgave er at lave en frontend, der hjælper kuratoren med at vælge kunstværkerne fra SMK's API og tilføje dem til eventet. Denne del skal være beskyttet bag et login, så kun kuratoren kan tilgå den.

Eventet skal også have en offentlig side (alle kan se), hvor brugere kan se eventet med de valgte kunstværker samt booke billetter, hvis der er nok pladser.

## Krav til systemet

### Overordnede Krav

1. **Oprettelse af et event:**

   - Kuratorer skal kunne oprette events via et formularflow. Et event skal indeholde følgende obligatoriske informationer:
     - Titel
     - Beskrivelse
     - Dato (skal være én af de foruddefinerede tilladte datoer (`/dates`))
     - Lokation (via `/locations`-endpointet)
     - Et array af værker (fra SMK's API)

2. **Event-oversigt:**

   - Kuratorer skal kunne se en liste over eksisterende events med mulighed for at redigere eller slette dem.
   - Brugere, der ikke er logget ind, skal også kunne se en oversigt over eksisterende events, men skal ikke kunne redigere eller slette dem (eller evt. se dem, der er sat til "draft").

3. **Event-side:**

   - Når et event er oprettet, skal det have en offentlig side, hvor brugere kan se eventdetaljer og tilknyttede værker.
   - Denne side skal evt. afvige fra kuratorens oprettelsesflow og vise værkerne i en mere visuel præsentation.

4. **Tilmelding af event (slutbrugere):**

   - Brugere skal kunne booke billetter til et event.
   - Der skal være en begrænsning på det maksimale antal billetter, der kan bookes pr. event (via `/max-tickets`-endpointet).
   - Booking-detaljer skal evt. gemmes i SupaBase, og der skal være en bekræftelse til brugeren efter booking.

Sørg for god UX, når kurator eller brugere møder konflikter i brugergrænsefladen, fx når et event ikke kan oprettes, hvis lokationen på den valgte dato allerede er i brug, eller når brugeren kun kan booke billetter inden for eventets maksimale billetantal osv.

---

## Forventet Adfærd

| Funktion                                     | Forventet Adfærd                                                                                                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Oprettelse af event                          | Event oprettes med unikt ID og lagres i systemets database.                                                                                                                     |
| Opdatering af event (inkl. dato og lokation) | Ændringer accepteres kun, hvis den nye kombination af dato og lokation ikke konflikter med et andet event. Ved konflikt returneres en 409 Conflict-status og en fejlmeddelelse. |
| Sletning af event                            | Det angivne event slettes, og systemet returnerer en bekræftelsesmeddelelse med oplysninger om det slettede event.                                                              |
| Ticket booking                               | Brugeren kan booke billetter indtil det maksimale antal nås. Systemet opdaterer automatisk det tilgængelige antal billetter og returnerer en bekræftelse på booking.            |

## User stories

| User Story                                                                                                                                | Expected Behavior                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Som bruger:** Jeg vil se en liste over tilgængelige events, så jeg kan vælge et event at deltage i.                                     | Systemet returnerer en liste (via GET /events) med alle events, inklusiv titel, dato, lokation, billetantal og billeder (placeholder anvendes, hvis ingen maleri-ID'er er tilknyttet).                       |
| **Som kurator:** Jeg vil oprette et nyt event med titel, dato, lokation, beskrivelse og maleri-ID'er, så jeg kan arrangere en udstilling. | En POST-anmodning til /events opretter et event, validerer dato og lokation, og returnerer det oprettede event med et unikt ID samt de indtastede oplysninger.                                               |
| **Som bruger:** Jeg vil se detaljer for et specifikt event, så jeg kan få alle relevante oplysninger.                                     | En GET-anmodning til /events/:id returnerer detaljer om det valgte event, inklusiv beskrivelse (som kan splittes på linjeskift), lokationsinformation og billeder.                                           |
| **Som bruger:** Jeg vil booke billetter til et event, så jeg kan reservere min plads.                                                     | En PUT-anmodning til /events/:id/book tjekker tilgængeligt billetantal, booker det ønskede antal billetter (under hensyntagen til mutex-lås for at forhindre race conditions) og returnerer opdateret event. |
| **Som kurator:** Jeg vil opdatere et event (f.eks. ændre titel, beskrivelse, maleri-ID'er) for at rette fejl eller opdatere information.  | En PATCH-anmodning til /events/:id opdaterer de medsendte felter (delvis opdatering) og returnerer det opdaterede event.                                                                                     |
| **Som kurator:** Jeg vil slette et event, hvis det aflyses eller ikke længere er relevant.                                                | En DELETE-anmodning til /events/:id fjerner det pågældende event og returnerer en bekræftelsesmeddelelse med oplysninger om det slettede event.                                                              |
| **Som system (administrator):** Jeg vil kunne nulstille alle events for at genskabe testmiljøet.                                          | En POST-anmodning til /events/reset nulstiller systemet ved at generere en ny samling events med tilfældige billetantal, hvorefter systemet returnerer en bekræftelse.                                       |

## Yderligere Funktioner (Valgfrit)

- Mulighed for at vælge mellem flere billetpriser (f.eks. Regular og VIP) med tilhørende opdatering af totalsummen, hvis man vælger at tilføje ekstra funktioner til bookingflowet.

## Ressourcer

- [SMK API](https://api.smk.dk/api/v1/docs/) (læs evt. [om API'et](https://www.smk.dk/article/om-smk-open/))
- Clerk til authentication
  - [Clerk Setup](https://clerk.com/docs/quickstarts/setup-clerk)
  - [Clerk Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- Evt. Supabase til opsamling af data på billetter

## API Docs

Link: [API Documentation](https://daviatkea.github.io/API/)
