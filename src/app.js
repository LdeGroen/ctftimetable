import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Functie om datumstring te parsen naar een Date-object voor vergelijking en weergave
const parseDateForSorting = (dateString) => {
  if (!dateString) return new Date(NaN);
  let day, month, year;

  let [d, m, y] = String(dateString).split('-');
  if (d && m && y && !isNaN(parseInt(m, 10))) {
    day = parseInt(d, 10);
    month = parseInt(m, 10);
    year = parseInt(y, 10);
    return new Date(Date.UTC(year, month - 1, day));
  }

  const monthNames = {
    'januari': 1, 'februari': 2, 'maart': 3, 'april': 4, 'mei': 5, 'juni': 6,
    'juli': 7, 'augustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'december': 12
  };
  const monthNamesAbbr = {
    'jan': 1, 'feb': 2, 'mrt': 3, 'apr': 4, 'mei': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'okt': 10, 'nov': 11, 'dec': 12
  };

  const parts = String(dateString).split(' ');
  if (parts.length === 3) {
    day = parseInt(parts[0], 10);
    let monthNum = monthNames[parts[1]?.toLowerCase()] || monthNamesAbbr[parts[1]?.toLowerCase()];
    year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthNum && !isNaN(year)) {
      return new Date(Date.UTC(year, monthNum - 1, day));
    }
  }

  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
      return new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));
  }

  return new Date(NaN);
};

// Vertalingen voor de app
const translations = {
  nl: {
    common: {
      timetable: 'Timetable',
      blockTimetable: 'Blokkenschema',
      favorites: 'Favorieten',
      searchPlaceholder: 'Zoek in alle voorstellingen...',
      moreDates: 'Meer dagen',
      lessDates: 'Minder dagen',
      loading: 'Timetable wordt ingeladen...',
      errorOops: 'Oeps, er ging iets mis!',
      errorLoading: 'Fout bij het laden van de dienstregeling. Probeer het later opnieuw of controleer de URL/sheet-structuur.',
      tryAgain: 'Opnieuw proberen',
      noFavoritesFound: 'Geen favoriete voorstellingen gevonden.',
      noSearchResults: 'Geen resultaten gevonden voor \'%s\'.',
      noDataFound: 'Geen dienstregelinggegevens gevonden voor %s.',
      moreInfo: 'Meer info',
      addToFavorites: 'Voeg toe aan favorieten',
      removeFromFavorites: 'Verwijder van favorieten',
      getNotifications: 'Ontvang notificaties',
      stopNotifications: 'Stop notificaties',
      addToGoogleCalendar: 'Voeg toe aan Google Agenda',
      sharePerformance: 'Deel voorstelling',
      close: 'Sluit pop-up',
      privacyPolicy: 'Privacybeleid',
      becomeRegularGuest: 'Word stamgast!',
      forEvent: 'voor %s',
      onThisDay: 'op deze dag',
      inYourFavorites: 'in je favorieten',
      noContentAvailable: 'Geen inhoud beschikbaar voor deze pop-up.',
      'openLocationInGoogleMaps': 'Open locatie in Google Maps',
      wheelchairAccessible: 'Rolstoeltoegankelijk',
      suitableForChildren: 'Geschikt voor kinderen',
      dutchLanguage: 'Nederlandse taal',
      englishLanguage: 'Engelse taal',
      dialogueFree: 'Dialogue Free',
      diningFacility: 'Eetgelegenheid',
      tooltipWheelchair: 'Deze locatie is rolstoeltoegankelijk en heeft een invalidentoilet',
      tooltipChildren: 'Deze voorstelling is geschikt voor kinderen vanaf 8 jaar',
      tooltipDutch: 'Deze voorstelling bevat Nederlandse tekst',
      tooltipEnglish: 'Deze voorstelling bevat Engelse tekst',
      tooltipDialogueFree: 'In deze voorstelling zit geen gesproken tekst',
      tooltipDining: 'Je kunt op deze locatie eten',
      tooltipNGT: 'Bij deze voorstelling is een Tolk Nederlandse Gebarentaal aanwezig',
      notificationTitle: 'Herinnering: Voorstelling begint bijna!',
      notificationBody: '%s in %s begint over 20 minuten.',
      genericNotificationTitle: 'Café Theater Festival',
      donateButton: 'Klik hier!',
      crowdLevel: 'Verwachte drukte:',
      genre: 'Genre',
      crowdLevelGreen: 'De verwachtte drukte bij deze voorstelling is normaal. Als je op tijd komt kun je waarschijnlijk een zitplekje vinden',
      crowdLevelOrange: 'De verwachtte drukte bij deze voorstelling is druk. We verwachten dat een deel van het publiek moet staan bij deze voorstelling om het goed te kunnen zien',
      crowdLevelRed: 'De verwachtte drukte bij deze voorstelling is erg druk. Kom op tijd, want het zou zo maar kunnen dat deze voorstelling vol raakt',
      crowdLevelFull: 'Deze voorstelling zit vol! Je kunt nog wel naar een van de andere voorstellingen gaan',
      tooltipCrowdLevelGreenFull: 'De verwachtte drukte bij deze voorstelling is normaal. Als je op tijd komt kun je waarschijnlijk een zitplekje vinden!',
      tooltipCrowdLevelOrangeFull: 'De verwachtte drukte bij deze voorstelling is druk. We verwachten dat een deel van het publiek moet staan bij deze voorstelling om het goed te kunnen zien!',
      tooltipCrowdLevelRedFull: 'De verwachtte drukte bij deze voorstelling is erg druk. Kom op tijd, want het zou zo maar kunnen dat deze voorstelling vol raakt.',
      tooltipCrowdLevelFull: 'Deze voorstelling is vol! Je kunt nog wel naar een van de andere voorstellingen gaan.',
      shareSuccess: 'Link gekopieerd naar klembord!',
      shareError: 'Delen mislukt.',
      shareBody: 'Bekijk deze voorstelling: %s op het Café Theater Festival!',
      exactAlarmPermissionNeededTitle: 'Notificaties werken mogelijk niet',
      exactAlarmPermissionNeededBody: 'Voor betrouwbare notificaties is de "Wekkers en herinneringen" permissie nodig. Schakel deze handmatig in via de app-instellingen.',
      openSettings: 'Open instellingen',
      mapTitle: 'Kaart %s',
      allPerformances: 'Alle voorstellingen',
      calmRoute: 'Rustige route',
      proudMainSponsor: 'Is trotse hoofdsponsor van %s',
      chooseCity: 'Kies stad',
      cardView: 'Voorstellingen', 
    },
    payWhatYouCan: {
      title: "Pay What You Can",
      text: `Bij het CTF hoef je nooit een kaartje te kopen of een plekje te reserveren! We vinden dat belangrijk omdat we in cafés spelen, en juist ook de mensen die niet voor de voorstelling komen willen uitnodigen te blijven zitten en de voorstelling mee te maken. Toch vragen we het publiek om ook financieel bij te dragen aan het festival en de makers. Dat doen we met ons **Pay What You Can** systeem.

Na de voorstelling komen de makers langs om te vragen om een financiële bijdrage van **€6,-, €8,-, of €10,- euro.** We hanteren verschillende bedragen omdat we er willen zijn voor bezoekers met een kleine én een grote portemonnee. Je kunt bij het CTF altijd met PIN, of via een QR-code met Tikkie betalen.`
    },
    crowdMeterInfo: {
      title: "Uitleg druktemeter",
      text: `Dit is onze druktemeter! Hier kun je van tevoren zien hoe druk we verwachten dat het bij een voorstelling wordt. We updaten deze druktemeter live, dus je kunt in je app zien als een voorstelling vol is.

**Uitleg kleuren:**
- Groen= de verwachtte drukte bij deze voorstelling is normaal. Als je op tijd komt kun je waarschijnlijk een zitplekje vinden
- Oranje= De verwachtte drukte bij deze voorstelling is druk. We verwachten dat een deel van het publiek moet staan bij deze voorstelling om het goed te kunnen zien
- Rood= De verwachtte drukte bij deze voorstelling is erg druk. Kom op tijd, want het zou zo maar kunnen dat deze voorstelling vol raakt
- Rode balk met kruis: Deze voorstelling zit vol! Je kunt nog wel naar een van de andere voorstellingen gaan`
    },
    calmRouteInfo: {
      title: 'Rustige Route',
      text: `Niet iedereen houdt van een druk en vol café en daarom hebben we de Rustige Route in het leven geroepen. Per festival zijn er twee voorstellingen waarbij het mogelijk is om een plek te reserveren, waardoor je verzekerd bent van een plaats. Daarnaast zullen de gekozen voorstellingen ook rustiger zijn dan sommige andere voorstellingen op het festival.

Let op: de voorstellingen in de rustige route zijn niet prikkel-arm. Vanwege het onvoorspelbare karakter van de caféruimte en het feit dat veel voorstellingen de hele ruimte gebruiken kunnen we bij geen enkel voorstelling een prikkel-arme omgeving garanderen.`,
      button: 'Reserveer een plekje'
    },
    privacyPolicyContent: `
      Privacybeleid voor de Café Theater Festival Timetable App

      Laatst bijgewerkt: 20 juni 2025

      Welkom bij de Café Theater Festival Timetable App. Deze app is ontworpen om u te helpen de timetable van het festival te bekijken, voorstellingen als favoriet te markeren, herinneringen in te stellen en evenementen aan uw agenda toe te voegen.

      Uw privacy is belangrijk voor ons. Dit privacybeleid beschrijft hoe wij informatie verzamelen, gebruiken en beschermen wanneer u onze app gebruikt.

      1. Welke Informatie Verzamelen Wij?

      Deze app is een statische webapplicatie die uitsluitend lokaal in uw browser (of via een WebView op Android) draait.

      Wij verzamelen de volgende niet-persoonlijke informatie:

      - Favoriete Voorstellingen: Wanneer u een voorstelling als favoriet markeert, wordt deze informatie uitsluitend lokaal opgeslagen op uw apparaat in de browser's lokale opslag (localStorage). Deze gegevens worden niet naar externe servers verzonden en zijn alleen toegankelijk voor u op het specifieke apparaat en in de specifieke browser waarmee u de favorieten heeft ingesteld. Als u de browsercache wist of de app van uw apparaat verwijdert, kunnen deze favorieten verloren gaan.

      - Notificatietoestemming: De app kan u om toestemming vragen om browsernotificaties te tonen voor herinneringen aan voorstellingen. Uw keuze (toestaan of weigeren) wordt lokaal door uw browser beheerd en niet door ons verzameld of opgeslagen. Wij verzenden geen pushnotificaties via een externe server; alle herinneringen worden door uw apparaat zelf beheerd.

      - Zoekopdrachten: Zoektermen die u invoert in de zoekbalk worden niet opgeslagen of verzonden naar externe servers. Ze worden alleen gebruikt om lokaal de timetable te filteren.

      2. Hoe Gebruiken Wij Uw Informatie?

      De lokaal opgeslagen informatie (favoriete voorstellingen) wordt alleen gebruikt om u een gepersonaliseerde ervaring binnen de app te bieden, zodat u gemakkelijk uw geselecteerde voorstellingen kunt terugvinden.

      3. Delen van Uw Informatie

      Wij delen uw informatie met niemand. Aangezien we geen persoonlijke informatie verzamelen of opslaan, is er ook geen informatie om te delen met derden.

      4. Externe Links

      Deze app bevat links naar externe websites, zoals de officiële website van het Café Theater Festival en Google Calendar. Wanneer u op deze links klikt, verlaat u onze app en bent u onderhevig aan het privacybeleid van die andere websites. Wij zijn niet verantwoordelijk voor de privacypraktijken van andere websites.

      5. Beveiliging
      Aangezien alle relevante gegevens lokaal op uw apparaat worden opgeslagen en er geen gevoelige persoonlijke informatie wordt verwerkt, zijn de beveiligingsrisico's minimaal. Wij nemen redelijke maatregelen om de veiligheid van de app te waarborgen.

      6. Wijzigingen in Dit Privacybeleid
      We kunnen ons privacybeleid van tijd tot tijd bijwerken. Wijzigingen zijn onmiddellijk van kracht nadat ze in de app zijn geplaatst. Wij raden u aan dit privacybeleid regelmatig te raadplegen voor eventuele wijzigingen.

      7. Contact Met Ons Opnemen
      Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via:

      Info@cafetheaterfestival.nl
    `,
  },
  en: {
    common: {
      timetable: 'Timetable',
      blockTimetable: 'Block Schedule',
      favorites: 'Favorites',
      searchPlaceholder: 'Search all performances...',
      moreDates: 'More days',
      lessDates: 'Fewer days',
      loading: 'Timetable is loading...',
      errorOops: 'Oops, something went wrong!',
      errorLoading: 'Error loading the timetable. Please try again later or check the URL/sheet structure.',
      tryAgain: 'Try again',
      noFavoritesFound: 'No favorite shows found.',
      noSearchResults: 'No results found for \'%s\'.',
      noDataFound: 'No timetable data found for %s.',
      moreInfo: 'More Info',
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites',
      getNotifications: 'Get Notifications',
      stopNotifications: 'Stop Notifications',
      addToGoogleCalendar: 'Add to Google Calendar',
      sharePerformance: 'Share performance',
      close: 'Close popup',
      privacyPolicy: 'Privacy Policy',
      becomeRegularGuest: 'Become a regular guest!',
      forEvent: 'for %s',
      onThisDay: 'on this day',
      inYourFavorites: 'in your favorites',
      noContentAvailable: 'No content available for this popup.',
      'openLocationInGoogleMaps': 'Open location in Google Maps',
      wheelchairAccessible: 'Wheelchair Accessible',
      suitableForChildren: 'Suitable for children',
      dutchLanguage: 'Dutch language',
      englishLanguage: 'English language',
      dialogueFree: 'Dialogue Free',
      diningFacility: 'Dining Facility',
      tooltipWheelchair: 'This location is wheelchair accessible and has a disabled toilet',
      tooltipChildren: 'This performance is suitable for children aged 8 and up',
      tooltipDutch: 'This performance contains Dutch text',
      tooltipEnglish: 'This performance contains English text',
      tooltipDialogueFree: 'This performance contains no spoken text',
      tooltipDining: 'You can eat at this location',
      tooltipNGT: 'A Dutch Sign Language interpreter is present at this performance',
      notificationTitle: 'Reminder: Performance starts soon!',
      notificationBody: '%s at %s starts in 20 minutes.',
      genericNotificationTitle: 'Café Theater Festival',
      donateButton: 'Click here!',
      crowdLevel: 'Expected crowd:',
      genre: 'Genre',
      crowdLevelGreen: 'The expected crowd for this performance is normal. If you arrive on time, you will probably find a seat',
      crowdLevelOrange: 'The expected crowd for this performance is busy. We expect some of the audience to stand to see it well',
      crowdLevelRed: 'The expected crowd for this performance is very busy. Arrive on time, as this performance might fill up',
      crowdLevelFull: 'This performance is full! You can still go to one of the other performances',
      tooltipCrowdLevelGreenFull: 'The expected crowd for this performance is normal. If you arrive on time, you will probably find a seat!',
      tooltipCrowdLevelOrangeFull: 'The expected crowd for this performance is busy. We expect some of the audience to stand to see it well.',
      tooltipCrowdLevelRedFull: 'The expected crowd for this performance is very busy. Arrive on time, as this performance might fill up.',
      tooltipCrowdLevelFull: 'This performance is full! You can still go to one of the other performances.',
      shareSuccess: 'Link copied to clipboard!',
      shareError: 'Share failed.',
      shareBody: 'Check out this performance: %s at the Café Theater Festival!',
      exactAlarmPermissionNeededTitle: 'Notifications may not work',
      exactAlarmPermissionNeededBody: 'For reliable notifications, the "Alarms & reminders" permission is required. Please enable it manually in the app settings.',
      openSettings: 'Open settings',
      mapTitle: 'Map %s',
      allPerformances: 'All performances',
      calmRoute: 'Calm Route',
      proudMainSponsor: 'Is proud main sponsor of %s',
      chooseCity: 'Choose city',
      cardView: 'Performances',
    },
    payWhatYouCan: {
      title: "Pay What You Can",
      text: `At CTF you never have to buy a ticket or reserve a spot! We think that is important because we play in cafes, and we also want to invite people who don't come for the performance to stay and experience the performance. Nevertheless, we ask the audience to also financially contribute to the festival and the creators. We do this with our **Pay What You Can** system.

After the performance, the makers will ask for a financial contribution of **€6, €8, or €10 euro.** We use different amounts because we want to be there for visitors with both small and large wallets. At CTF you can always pay with PIN, or via a QR code with Tikkie.`
    },
    crowdMeterInfo: {
      title: "Explanation Crowd Meter",
      text: `This is our crowd meter! Here you can see in advance how busy we expect a performance to be. We update this crowd meter live, so you can see in your app if a performance is full.

**Explanation of colors:**
- Green= The expected crowd for this performance is normal. If you arrive on time, you will probably find a seat
- Orange= The expected crowd for this performance is busy. We expect some of the audience to stand to see it well
- Red= The expected crowd for this performance is very busy. Arrive on time, as this performance might fill up
- Red bar with cross: This performance is full! You can still go to one of the other performances`
    },
    calmRouteInfo: {
        title: 'Calm Route',
        text: `Not everyone enjoys a crowded and busy café, which is why we created the Calm Route. For each festival, there are two performances for which it is possible to reserve a spot, ensuring you have a seat. Additionally, the selected performances will also be quieter than some other performances at the festival.

Please note: the performances in the calm route are not low-stimulus. Due to the unpredictable nature of the café space and the fact that many performances use the entire space, we cannot guarantee a low-stimulus environment for any performance.`,
        button: 'Reserve a spot'
    },
    privacyPolicyContent: `
      Privacy Policy for the Café Theater Festival Timetable App

      Last updated: June 20, 2025

      Welcome to the Café Theater Festival Timetable App. This app is designed to help you view the festival timetable, mark performances as favorites, set reminders, and add events to your calendar.

      Your privacy is important to us. This privacy policy describes how we collect, use, and protect information when you use our app.

      1. What Information Do We Collect?

      This app is a static web application that runs exclusively locally in your browser (or via a WebView on Android).

      We collect the following non-personal information:

      - Favorite Performances: When you mark a performance as a favorite, this information is stored exclusively locally on your device in the browser's local storage (localStorage). This data is not sent to external servers and is only accessible to you on the specific device and in the specific browser with which you set the favorites. If you clear your browser cache or uninstall the app from your device, these favorites may be lost.

      - Notification Permission: The app may ask for your permission to display browser notifications for performance reminders. Your choice (allow or deny) is managed locally by your browser and is not collected or stored by us. We do not send push notifications via an external server; all reminders are managed by your device itself.

      - Search Queries: Search terms you enter in the search bar are not stored or sent to an external server. They are only used to filter the timetable locally.

      3. Sharing Your Information

      We do not share your information with anyone. Since we do not collect or store any personal information, there is no information to share with third parties.

      4. External Links

      This app contains links to external websites, such as the official Café Theater Festival website and Google Calendar. When you click on these links, you leave our app and are subject to the privacy policies of those external websites. We are not responsible for the privacy practices of other sites.

      5. Security
      Since all relevant data is stored locally on your device and no sensitive personal information is processed, the security risks are minimal. We take reasonable measures to ensure the security of the app.

      6. Changes to This Privacy Policy
      We may update our privacy policy from time to time. Changes are effective immediately after they are posted in the app. We encourage you to review this privacy policy periodically for any changes.

      7. Contact Us
      If you have any questions about this privacy policy, you can contact us at:

      Info@cafetheaterfestival.nl
    `,
  },
};


// Function to render privacy policy content with proper HTML structure
const renderPrivacyPolicyContent = (content, textColorClass = 'text-gray-700') => {
  const lines = content.trim().split('\n');
  const elements = [];
  let currentList = [];

  const addCurrentList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className={`list-disc pl-5 mb-4 ${textColorClass}`}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^\d+\.\s/)) { // Headings
      addCurrentList(); // Close any open list
      elements.push(<h3 key={`h3-${index}`} className={`text-xl font-bold mb-2 ${textColorClass}`}>{trimmedLine}</h3>);
    } else if (trimmedLine.startsWith('- ')) { // List items
      const listItemContent = trimmedLine.substring(2).trim();
      currentList.push(
        <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: listItemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      );
    } else if (trimmedLine === '') { // Empty line
      addCurrentList(); // Close any open list
    } else { // Paragraph
      addCurrentList(); // Close any open list
      elements.push(
        <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className={`mb-4 last:mb-0 ${textColorClass}`} />
      );
    }
  });

  addCurrentList(); // Add any remaining list items at the end

  return elements;
};

// New helper function for rendering generic text popups (Pay What You Can, Crowd Meter Info)
const renderGenericPopupText = (content, language, translations) => {
  const lines = content.trim().split('\n\n'); // Split by double newlines for paragraphs
  const elements = lines.map((line, index) => (
      <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="mb-4 last:mb-0 text-white" />
  ));
  return elements;
};

// Component for the top-right controls that are always visible initially
const TopRightControls = ({ language, handleLanguageChange }) => (
    <div className="absolute top-12 right-4 z-10 flex flex-row items-center space-x-2">
        {/* Language Switcher */}
        <button
            onClick={handleLanguageChange}
            className="px-3 py-1 h-8 sm:h-10 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-sm font-semibold"
        >
            {language === 'nl' ? 'EN' : 'NL'}
        </button>
        {/* Photo Gallery Icon */}
        <a href="https://ldegroen.github.io/ctffotos/" target="_blank" rel="noopener noreferrer" title="Fotogalerij" className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </a>
        {/* Instagram Icon */}
        <a href="https://www.instagram.com/cafetheaterfestival/" target="_blank" rel="noopener noreferrer" title="Instagram" className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
    </div>
);


// Component for the app-header (logo, titel, taalwisselaar, privacybeleid)
const AppHeader = ({ titleRef, translations, language }) => (
  <div className="flex flex-col items-center w-full pt-16">
    {/* [Afbeelding van Café Theater Festival Logo in wit] */}
    <img
      src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Logo_Web_Trans_Wit.png"
      alt="[Afbeelding van Café Theater Festival Logo in wit]"
      className="w-full max-w-[10rem] h-auto mb-4"
    />

    {/* Titel van de app */}
    <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 text-center drop_shadow-lg font-oswald">
      {translations[language].common.timetable}
    </h1>
  </div>
);

// NIEUW: Sticky Header component
const StickyHeader = ({ isVisible, uniqueEvents, handleEventClick, handleFavoritesClick, handleBlockTimetableClick, selectedEvent, currentView, language, handleLanguageChange, translations, onLogoClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    let currentSelectionText = translations[language].common.chooseCity;
    if (currentView === 'favorites') {
        currentSelectionText = translations[language].common.favorites;
    } else if (currentView === 'block') {
        currentSelectionText = translations[language].common.blockTimetable;
    } else if (selectedEvent) {
        currentSelectionText = selectedEvent;
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-24 sm:h-20 items-end justify-center bg-black/20 backdrop-blur-md rounded-b-xl px-4 shadow-lg pb-2">
                    <div className="absolute left-4 bottom-2">
                       <img 
                            onClick={onLogoClick}
                            className="h-16 w-auto cursor-pointer" 
                            src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav-wit-1.png" 
                            alt="[Afbeelding van Café Theater Festival Logo in wit]"
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                className="inline-flex justify-center w-full rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-white/30 text-sm font-medium text-white hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            >
                                {currentSelectionText}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div 
                                    className="origin-top-right absolute right-1/2 translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-[#1a5b64] ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        {uniqueEvents.map(event => (
                                            <a href="#" key={event} onClick={(e) => { e.preventDefault(); handleEventClick(event); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center" role="menuitem">
                                                {event}
                                            </a>
                                        ))}
                                         <a href="#" onClick={(e) => { e.preventDefault(); handleFavoritesClick(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center border-t border-white/20" role="menuitem">
                                            {translations[language].common.favorites}
                                        </a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleBlockTimetableClick(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center border-t border-white/20" role="menuitem">
                                            {translations[language].common.blockTimetable}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="absolute right-4 bottom-2 flex items-center space-x-2">
                        <button
                            onClick={handleLanguageChange}
                            className="px-3 py-1 h-8 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-xs font-semibold"
                        >
                            {language === 'nl' ? 'EN' : 'NL'}
                        </button>
                        <a href="https://ldegroen.github.io/ctffotos/" target="_blank" rel="noopener noreferrer" title="Fotogalerij" className="flex items-center justify-center h-8 w-8 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </a>
                        <a href="https://www.instagram.com/cafetheaterfestival/" target="_blank" rel="noopener noreferrer" title="Instagram" className="flex items-center justify-center h-8 w-8 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Component voor de evenementnavigatiebalk op het startscherm
const EventNavigation = ({ onEventSelect, onFavoritesSelect, onBlockTimetableSelect, uniqueEvents, language, translations, refProp }) => (
    <div ref={refProp} className="flex flex-wrap justify-center gap-4 mb-8 p-3 max-w-full">
        {uniqueEvents.map(event => (
            <button
                key={event}
                onClick={() => onEventSelect(event)}
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50"
            >
                {event}
            </button>
        ))}
        <button
            onClick={onFavoritesSelect}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50"
        >
            {translations[language].common.favorites}
        </button>
        <button
            onClick={onBlockTimetableSelect}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50"
        >
            {translations[language].common.blockTimetable}
        </button>
    </div>
);

// Component voor de datumnavigatiebalk
const DateNavigation = ({
  loading, error, datesForCurrentSelectedEvent, visibleDatesForEvent, hiddenDatesForEvent,
  showMoreDates, setShowMoreDates, selectedDate, setSelectedDate, setSearchTerm, translations, language, currentView,
  timetableData, selectedEvent
}) => {
    const hasCalmRoutePerformances = useMemo(() => {
        if (!selectedEvent || !timetableData) return false;
        return timetableData.some(item => item.event === selectedEvent && item.isCalmRoute);
    }, [timetableData, selectedEvent]);
    
    return (
      <>
        {currentView === 'timetable' && !loading && !error && datesForCurrentSelectedEvent.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
            {/* Alle Voorstellingen Knop */}
            <button
              onClick={() => { setSelectedDate('all-performances'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedDate === 'all-performances'
                  ? 'bg-[#1a5b64] text-white shadow-md'
                  : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
              }`}
            >
              {translations[language].common.allPerformances}
            </button>
            
            {/* Toon de datums */}
            {visibleDatesForEvent.map(date => (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedDate === date
                    ? 'bg-[#1a5b64] text-white shadow-md'
                    : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
                }`}
              >
                {date}
              </button>
            ))}
            {showMoreDates && hiddenDatesForEvent.map(date => (
               <button
                 key={date}
                 onClick={() => { setSelectedDate(date); setSearchTerm(''); }}
                 className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                   selectedDate === date
                     ? 'bg-[#1a5b64] text-white shadow-md'
                     : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
                 }`}
               >
                 {date}
               </button>
            ))}
            {hiddenDatesForEvent.length > 0 && (
              <button
                onClick={() => setShowMoreDates(!showMoreDates)}
                className="px-4 py-2 rounded-lg font-semibold bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-all duration-200"
              >
                {showMoreDates ? translations[language].common.lessDates : translations[language].common.moreDates}
              </button>
            )}
            {/* Rustige Route Knop */}
            {hasCalmRoutePerformances && (
                <button
                    onClick={() => { setSelectedDate('calm-route'); setSearchTerm(''); }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        selectedDate === 'calm-route'
                        ? 'bg-[#1a5b64] text-white shadow-md'
                        : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
                    }`}
                >
                    {translations[language].common.calmRoute}
                </button>
            )}
          </div>
        )}
      </>
    );
};

// Nieuw component voor het tonen van de sponsor
const SponsorDisplay = React.forwardRef(({ sponsorInfo, language, translations }, ref) => {
    if (!sponsorInfo || !sponsorInfo.logoUrl) {
        return <div ref={ref} className="h-12"></div>; // Placeholder to maintain space
    }

    return (
        <div ref={ref} className="flex flex-col items-center justify-center mt-12 mb-8 text-center">
            <img 
                src={sponsorInfo.logoUrl} 
                alt={`[Afbeelding van Hoofdsponsor logo ${sponsorInfo.eventName}]`}
                className="max-h-20 w-auto object-contain mb-2"
            />
            <p className="text-white text-lg font-semibold">
                {translations[language].common.proudMainSponsor.replace('%s', sponsorInfo.eventName)}
            </p>
        </div>
    );
});

// Component voor de zoekbalk
const SearchBar = ({ searchTerm, setSearchTerm, translations, language }) => (
  <div className="w-full max-w-md mb-8 px-4 mx-auto">
    <input
      type="text"
      placeholder={translations[language].common.searchPlaceholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1a5b64] focus:ring focus:ring-[#1a5b64] focus:ring-opacity-50 text-gray-800 shadow-md"
    />
  </div>
);

// Component voor een enkele voorstellingskaart
const PerformanceCard = ({
  item, favorites, toggleFavorite, notificationSubscriptions, toggleNotificationSubscription,
  addToGoogleCalendar, openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations, showMessageBox,
  hideTime = false
}) => {
    const getCrowdLevelInfo = (level) => {
        let position = '10%'; 
        let isFull = false;

        switch (level?.toLowerCase()) {
            case 'oranje':
            case 'orange':
                position = '50%';
                break;
            case 'rood':
            case 'red':
                position = '90%';
                break;
            case 'vol':
            case 'full':
                isFull = true;
                break;
            case 'groen':
            case 'green':
            default:
                position = '10%';
                break;
        }
        const tooltipTextKey = `tooltipCrowdLevel${level?.charAt(0).toUpperCase() + level?.slice(1)}Full`;
        const tooltipText = translations[language].common[tooltipTextKey] || translations[language].common.tooltipCrowdLevelGreenFull;
        
        return { position, tooltipText, isFull };
    };

    const crowdInfo = item.crowdLevel ? getCrowdLevelInfo(item.crowdLevel) : null;

    const handleShare = async (e, title, url) => {
        e.stopPropagation();
        const shareText = translations[language].common.shareBody.replace('%s', title);
        const shareData = { title, text: shareText, url: url || window.location.href };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return; 
            } catch (error) {
                if (error.name === 'AbortError') return;
                console.warn('navigator.share failed, trying clipboard fallback:', error);
            }
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(shareData.url);
                showMessageBox(translations[language].common.shareSuccess);
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
                showMessageBox(translations[language].common.shareError);
            }
        } else {
            showMessageBox(translations[language].common.shareError);
        }
    };

    const safetyIcons = [
        { key: 'hasNGT', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/vgtliggend-1-removebg-preview.png', tooltip: translations[language].common.tooltipNGT },
        { key: 'wheelchairAccessible', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_Rolstoeltoegankelijk.png', tooltip: translations[language].common.tooltipWheelchair },
        { key: 'suitableForChildren', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_Geschikt-Voor-Kinderen.png', tooltip: translations[language].common.tooltipChildren },
        { key: 'dutchLanguage', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_NL.png', tooltip: translations[language].common.tooltipDutch },
        { key: 'englishLanguage', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_ENG.png', tooltip: translations[language].common.tooltipEnglish },
        { key: 'dialogueFree', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_DIALOGUE-FREE.png', tooltip: translations[language].common.tooltipDialogueFree },
        { key: 'diningFacility', url: 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-ICONS_Eetmogelijkheid.png', tooltip: translations[language].common.tooltipDining },
    ];

    return (
        <div
            className={`text-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col relative min-h-[180px] w-full md:w-[384px] bg-white`}
            onClick={() => openContentPopup('iframe', item.url)}
        >
            {!hideTime && <p className="text-xl font-bold text-gray-800 mb-2">{item.time}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2">
                <h3 className="text-lg font-semibold text-[#20747f] mb-2 sm:mb-0 sm:mr-4">
                    {item.title}
                </h3>
                <a
                    href={item.googleMapsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        if (!item.googleMapsUrl) e.preventDefault();
                        e.stopPropagation();
                    }}
                    className={`flex items-center text-gray-600 text-sm ${item.googleMapsUrl ? 'hover:text-[#1a5b64] cursor-pointer' : 'cursor-default'} transition-colors duration-200`}
                    title={item.googleMapsUrl ? translations[language].common.openLocationInGoogleMaps : ''}
                >
                    {item.location}
                    {item.googleMapsUrl && (
                        <span className="ml-1 text-[#20747f]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                {item.mapNumber && item.mapNumber !== 'N/A' && (
                                    <text x="12" y="10.5" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="9" fontWeight="bold">
                                        {item.mapNumber}
                                    </text>
                                )}
                            </svg>
                        </span>
                    )}
                </a>
            </div>
            
             <div className="flex items-start gap-x-6 mb-4">
                {!hideTime && crowdInfo && item.crowdLevel !== 'N/A' && (
                  <div className="flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); openContentPopup('text', translations[language].crowdMeterInfo); }}>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{translations[language].common.crowdLevel}</p>
                    <div className={`relative w-full h-4 rounded-full ${crowdInfo.isFull ? 'bg-red-600' : 'bg-gradient-to-r from-green-600 via-yellow-500 to-red-600'}`} onMouseEnter={(e) => handleIconMouseEnter(e, crowdInfo.tooltipText)} onMouseLeave={handleIconMouseLeave}>
                        {!crowdInfo.isFull ? (<div className="absolute top-0 w-2 h-full rounded-full bg-gray-800" style={{ left: crowdInfo.position, transform: 'translate(-50%, -50%)', top: '50%' }}></div>) 
                        : (<div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-xs uppercase">{language === 'nl' ? 'Vol' : 'Full'}</span></div>)}
                    </div>
                  </div>
                )}
                {item.genre && item.genre !== 'N/A' && (
                    <div className="flex-1">
                         <p className="text-sm font-semibold text-gray-700 mb-1">{translations[language].common.genre}</p>
                         <p className="text-md font-semibold text-[#20747f]">{item.genre}</p>
                    </div>
                )}
            </div>

            <div className="absolute top-4 right-4 flex flex-row space-x-2">
                {!hideTime && ['favorite', 'notification', 'calendar', 'share'].map(type => {
                    const icons = {
                        favorite: { title: favorites.has(item.id) ? translations[language].common.removeFromFavorites : translations[language].common.addToFavorites, className: favorites.has(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400', fill: favorites.has(item.id) ? 'currentColor' : 'none', stroke: 'currentColor', path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                        notification: { title: notificationSubscriptions.has(item.id) ? translations[language].common.stopNotifications : translations[language].common.getNotifications, className: notificationSubscriptions.has(item.id) ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400', fill: notificationSubscriptions.has(item.id) ? 'currentColor' : 'none', stroke: 'currentColor', path: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" },
                        calendar: { title: translations[language].common.addToGoogleCalendar, className: 'text-gray-500 hover:text-gray-700', fill: 'none', stroke: 'currentColor', path: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></> },
                        share: { title: translations[language].common.sharePerformance, className: 'text-gray-500 hover:text-gray-700', fill: 'none', stroke: 'currentColor', path: <><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></> },
                    };
                    const icon = icons[type];
                    const clickHandlers = {
                        favorite: (e) => toggleFavorite(item, e),
                        notification: (e) => toggleNotificationSubscription(item, e),
                        calendar: (e) => addToGoogleCalendar(e, item.title, item.date, item.time, item.location),
                        share: (e) => handleShare(e, item.title, item.url),
                    };

                    return (
                        <div key={type} className="cursor-pointer" onClick={clickHandlers[type]} title={icon.title}>
                           <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors duration-200 ${icon.className}`} viewBox="0 0 24 24" fill={icon.fill} stroke={icon.stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                {typeof icon.path === 'string' ? <path d={icon.path} /> : icon.path}
                           </svg>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-4 border-t border-gray-200 w-full gap-4">
                <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                    {safetyIcons.map(icon => item.safetyInfo[icon.key] && (
                        <span key={icon.key} className="text-gray-600 flex items-center" onMouseEnter={(e) => handleIconMouseEnter(e, icon.tooltip)} onMouseLeave={handleIconMouseLeave}>
                            <img src={icon.url} alt={icon.tooltip} className="h-6 w-auto inline-block"/>
                        </span>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    {item.isCalmRoute && (
                         <button onClick={(e) => { e.stopPropagation(); openContentPopup('calmRouteInfo', translations[language].calmRouteInfo);}} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm font-semibold text-center">
                            {translations[language].common.calmRoute}
                        </button>
                    )}
                    {item.pwycLink && (
                        <button onClick={(e) => { e.stopPropagation(); window.open(item.pwycLink, '_blank'); }} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm font-semibold text-center" title={translations[language].payWhatYouCan.title}>
                            {translations[language].payWhatYouCan.title}
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); openContentPopup('iframe', item.url); }} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm" disabled={!item.url || item.url === 'N/A'}>
                        {translations[language].common.moreInfo}
                    </button>
                </div>
            </div>
        </div>
    );
};


// Component voor het weergeven van de dienstregeling of favorieten
const TimetableDisplay = ({
  loading, error, displayedData, currentView, favorites, toggleFavorite,
  notificationSubscriptions, toggleNotificationSubscription, addToGoogleCalendar,
  openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations,
  selectedEvent, searchTerm, showMessageBox, selectedDate
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-20 rounded-xl shadow-lg animate-pulse">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold">{translations[language].common.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-70 text-white p-4 rounded-xl shadow-lg text-center font-semibold max-w-lg">
        <p className="mb-2">{translations[language].common.errorOops}</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-700 hover:bg-red-800 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          {translations[language].common.tryAgain}
        </button>
      </div>
    );
  }

  if (displayedData.length === 0) {
    return (
      <div className="bg-white bg-opacity-20 p-6 rounded-xl shadow-lg text-center font-semibold">
        <p>
          {searchTerm
            ? translations[language].common.noSearchResults.replace('%s', `'${searchTerm}'`)
            : currentView === 'favorites'
            ? translations[language].common.noFavoritesFound
            : translations[language].common.noDataFound.replace('%s', (selectedEvent || ''))
          }
        </p>
      </div>
    );
  }

  const isAllPerformancesView = selectedDate === 'all-performances';

  return (
    <div className="w-full max-w-6xl mx-auto">
      {displayedData.map((group, index) => (
        <div key={index} className="mb-8">
          {group.groupTitle && (
            <h2 className="text-2xl font-bold text-white mb-6 text-center drop_shadow-lg">
              {group.groupTitle}
            </h2>
          )}
          {group.subGroups.map((subGroup, subIndex) => (
            <div key={subIndex} className="mb-8 last:mb-0">
              {subGroup.subGroupTitle && (
                <h3 className="text-xl font-semibold text-white mb-4 text-center drop_shadow">
                  {subGroup.subGroupTitle}
                </h3>
              )}
              <div className="flex flex-wrap gap-6 justify-center">
                {subGroup.items.map((item) => (
                  <PerformanceCard
                    key={item.id}
                    item={item}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    notificationSubscriptions={notificationSubscriptions}
                    toggleNotificationSubscription={toggleNotificationSubscription}
                    addToGoogleCalendar={addToGoogleCalendar}
                    openContentPopup={openContentPopup}
                    language={language}
                    handleIconMouseEnter={handleIconMouseEnter}
                    handleIconMouseLeave={handleIconMouseLeave}
                    translations={translations}
                    showMessageBox={showMessageBox}
                    hideTime={isAllPerformancesView}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


// NIEUW: Blokkenschema component
const BlockTimetable = ({ allData, favorites, selectedEvent, setSelectedEventInBlock, uniqueEvents, openContentPopup, translations, language, isFavoritesView = false }) => {
    const [selectedDay, setSelectedDay] = useState(null);

    const sourceData = useMemo(() => 
        isFavoritesView ? allData.filter(p => favorites.has(p.id)) : allData,
        [isFavoritesView, allData, favorites]
    );

    const eventPerformances = useMemo(() => 
        isFavoritesView ? sourceData : sourceData.filter(p => p.event === selectedEvent), 
        [isFavoritesView, sourceData, selectedEvent]
    );

    const availableDays = useMemo(() => 
        [...new Set(eventPerformances.map(p => p.date).filter(Boolean))]
        .sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b)), 
        [eventPerformances]
    );

    useEffect(() => {
        if (!availableDays.includes(selectedDay)) {
            setSelectedDay(availableDays[0] || null);
        }
    }, [selectedEvent, availableDays, selectedDay]);

    const gridData = useMemo(() => {
        if (!selectedDay) return { locations: [], timeSlots: [], grid: {} };
        
        const dayPerformances = eventPerformances.filter(p => p.date === selectedDay);
        if (dayPerformances.length === 0) return { locations: [], timeSlots: [], grid: {} };

        const locations = [...new Set(dayPerformances.map(p => p.location).filter(Boolean))].sort();

        let minTime = 23.5, maxTime = 0;
        dayPerformances.forEach(p => {
            if (!p.time) return;
            const [h, m] = p.time.split(':').map(Number);
            const timeVal = h + m / 60;
            if (timeVal < minTime) minTime = timeVal;
            if (timeVal > maxTime) maxTime = timeVal;
        });

        const startTime = Math.floor(minTime);
        const endTime = Math.ceil(maxTime) + 1;
        const timeSlots = [];
        for (let h = startTime; h < endTime; h++) {
            timeSlots.push(`${String(h).padStart(2, '0')}:00`);
            timeSlots.push(`${String(h).padStart(2, '0')}:30`);
        }

        const grid = {};
        locations.forEach(loc => {
            grid[loc] = {};
            timeSlots.forEach(slot => { grid[loc][slot] = null; });
        });

        dayPerformances.forEach(p => {
            if (grid[p.location]) {
                const [h, m] = p.time.split(':').map(Number);
                const timeSlot = `${String(h).padStart(2, '0')}:${m < 30 ? '00' : '30'}`;
                if (grid[p.location][timeSlot] === null) {
                    grid[p.location][timeSlot] = p;
                }
            }
        });
        
        return { locations, timeSlots, grid };
    }, [selectedDay, eventPerformances]);
    
    if (!isFavoritesView && !selectedEvent) {
        return <div className="text-center text-white p-4">{translations[language].common.chooseCity}</div>
    }

    return (
        <div className="w-full text-white">
            {!isFavoritesView && (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-4 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
                    {uniqueEvents.map(event => (
                        <button
                            key={event}
                            onClick={() => setSelectedEventInBlock(event)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedEvent === event ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}
                        >
                            {event}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
                {availableDays.length > 0 ? availableDays.map(day => (
                    <button 
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedDay === day ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}
                    >
                        {day}
                    </button>
                )) : <p>{isFavoritesView ? translations[language].common.noFavoritesFound : translations[language].common.noDataFound.replace('%s', selectedEvent)}</p>}
            </div>

            {availableDays.length > 0 && selectedDay && (
                <div className="overflow-x-auto bg-black bg-opacity-20 p-4 rounded-lg">
                    <div className="inline-grid gap-px" style={{ gridTemplateColumns: `150px repeat(${gridData.timeSlots.length}, 120px)` }}>
                        {/* Cel in de linkerbovenhoek. `sticky` en `z-20` zorgen ervoor dat deze boven alles blijft. */}
                        <div className="sticky top-0 left-0 bg-[#20747f] z-20"></div> 
                        {/* Tijd-headers. `sticky top-0` zorgt ervoor dat deze bovenaan blijven. */}
                        {gridData.timeSlots.map(time => (
                            <div key={time} className="sticky top-0 text-center font-bold p-2 border-b border-white/20 bg-[#20747f] z-10">
                                {time}
                            </div>
                        ))}
                        {gridData.locations.map((loc, locIndex) => (
                            <React.Fragment key={loc}>
                                {/* Locatiecel: `sticky left-0` zorgt ervoor dat deze aan de linkerkant vast blijft zitten tijdens horizontaal scrollen. */}
                                <div className="sticky left-0 p-2 font-bold bg-[#20747f] z-10 text-right pr-4 border-r border-white/20" style={{ gridRow: locIndex + 2 }}>
                                    {loc}
                                </div>
                                {gridData.timeSlots.map(time => {
                                    const performance = gridData.grid[loc]?.[time];
                                    return (
                                        <div key={`${loc}-${time}`} className="border-r border-b border-white/10 p-1 min-h-[60px] flex items-center justify-center">
                                            {performance ? (
                                                <div 
                                                    onClick={() => openContentPopup('iframe', performance.url)}
                                                    className="bg-[#1a5b64] text-white text-xs p-2 rounded-md w-full h-full cursor-pointer hover:bg-[#2e9aaa] transition-colors flex items-center justify-center text-center"
                                                >
                                                    {performance.title}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


// Component voor de algemene pop-up
const PopupModal = ({ showPopup, closePopup, popupContent, language, translations }) => {
  if (!showPopup) return null;

  const renderContent = () => {
    if (!popupContent || !popupContent.data) {
      return (<div className="flex items-center justify-center h-full text-xl text-white">{translations[language].common.noContentAvailable}</div>);
    }

    switch(popupContent.type) {
        case 'text':
            const { title = '', text = '' } = popupContent.data;
            return (
                <div className="p-4 overflow-y-auto leading-relaxed flex-grow">
                  <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
                  {renderGenericPopupText(text, language, translations)}
                </div>
            );
        case 'calmRouteInfo':
            const { title: calmTitle, text: calmText, button } = popupContent.data;
            return (
                <div className="p-6 overflow-y-auto leading-relaxed flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-white">{calmTitle}</h2>
                    <div className="text-white space-y-4">
                      {calmText.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                    <a href="mailto:programmering@cafetheaterfestival.nl?subject=Reserveren%20plek%20rustige%20route" className="mt-6 self-center px-6 py-3 bg-white text-[#20747f] rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-base font-semibold">
                        {button}
                    </a>
                </div>
            );
        case 'iframe':
        case 'image':
            const src = typeof popupContent.data === 'string' ? popupContent.data.trim() : '';
            if (!src) return (<div className="flex items-center justify-center h-full text-xl text-white">{translations[language].common.noContentAvailable}</div>);

            return popupContent.type === 'iframe' ? (
                <iframe src={src} title="Meer informatie" className="w-full h-full border-0 rounded-b-lg"></iframe>
            ) : (
                <div className="w-full h-full flex items-center justify-center p-4"><img src={src} alt="Kaart" className="max-w-full max-h-full object-contain rounded-lg"/></div>
            );
        default:
             return (<div className="flex items-center justify-center h-full text-xl text-white">{translations[language].common.noContentAvailable}</div>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-[#20747f] text-white p-4 rounded-xl shadow-2xl relative w-[95vw] h-[90vh] flex flex-col">
        <button onClick={closePopup} className="absolute top-2 right-2 text-white hover:text-gray-200 text-3xl font-bold z-10" aria-label={translations[language].common.close}>&times;</button>
        {renderContent()}
      </div>
    </div>
  );
};

// Component voor de privacybeleid pop-up
const PrivacyPolicyModal = ({ showPrivacyPolicy, setShowPrivacyPolicy, language, renderPrivacyPolicyContent, translations }) => {
  if (!showPrivacyPolicy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl relative w-[95vw] h-[90vh] max-w-4xl flex flex-col">
        <button onClick={() => setShowPrivacyPolicy(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10" aria-label={translations[language].common.close}>&times;</button>
        <div className="overflow-y-auto flex-grow">
            <h2 className="text-2xl font-bold mb-4 text-[#20747f]">{translations[language].common.privacyPolicy}</h2>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" style={{ color: '#333' }}>
              {renderPrivacyPolicyContent(translations[language].privacyPolicyContent)}
            </div>
        </div>
      </div>
    </div>
  );
};

// Component voor de custom tooltip
const CustomTooltip = ({ showCustomTooltip, customTooltipContent, customTooltipPosition }) => {
  if (!showCustomTooltip) return null;

  return (
    <div className="fixed bg-[#20747f] text-white p-3 rounded-md shadow-lg z-50 text-base pointer-events-none" style={{ left: customTooltipPosition.x, top: customTooltipPosition.y }}>
      {customTooltipContent}
    </div>
  );
};

// Component voor een custom message box (ter vervanging van alert())
const MessageBox = ({ message, show, onClose, onAction, actionButtonText }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
        <div className="text-lg font-medium text-gray-800 mb-4">{message}</div>
        <div className="flex justify-center space-x-4">
            {onAction && actionButtonText && (<button onClick={onAction} className="bg-[#20747f] hover:bg-[#1a5b64] text-white font-bold py-2 px-4 rounded-lg transition duration-300">{actionButtonText}</button>)}
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300">OK</button>
        </div>
      </div>
    </div>
  );
};

// Component voor de footer buttons
const FooterButtons = ({ openContentPopup, language, translations, showPopup, showStickyHeader }) => (
  <div className={`fixed bottom-4 inset-x-0 z-50 flex justify-center space-x-4 transition-opacity duration-300 ${showPopup || !showStickyHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
      <button onClick={() => openContentPopup('iframe', 'https://form.jotform.com/223333761374051')} className="px-6 py-3 bg-white text-[#20747f] rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-base font-semibold">
        {translations[language].common.becomeRegularGuest}
      </button>
    </div>
  </div>
);

// De hoofdcomponent van de app
const App = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMoreDates, setShowMoreDates] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ type: null, data: null });
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('timetable'); 
  const [uniqueEvents, setUniqueEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [notificationSubscriptions, setNotificationSubscriptions] = useState(new Set());
  const [customNotifications, setCustomNotifications] = useState([]);
  const [scheduledCustomNotifications, setScheduledCustomNotifications] = useState(new Set());
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'nl');
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);
  const [customTooltipContent, setCustomTooltipContent] = useState('');
  const [customTooltipPosition, setCustomTooltipPosition] = useState({ x: 0, y: 0 });
  const [messageBoxShow, setMessageBoxShow] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');
  const [messageBoxAction, setMessageBoxAction] = useState(null);
  const [messageBoxActionButtonText, setMessageBoxActionButtonText] = useState('');
  const [eventInfoMap, setEventInfoMap] = useState({});
  const [currentSponsorInfo, setCurrentSponsorInfo] = useState(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [favoritesViewMode, setFavoritesViewMode] = useState('card');
  const [animationClass, setAnimationClass] = useState('');
  const [contentKey, setContentKey] = useState(0);

  const titleRef = useRef(null);
  const sponsorRef = useRef(null);
  const notificationTimeouts = useRef({}); 
  
  const handleNavigation = useCallback((action, isDirectTransition = false) => {
    if (isDirectTransition) {
        setAnimationClass('animate-slide-out');
        setTimeout(() => {
            action();
            setContentKey(prev => prev + 1);
            setAnimationClass('animate-slide-in');
        }, 300);
    } else {
        setIsInitialLoad(true);
        setTimeout(() => {
            action();
            setIsInitialLoad(false);
            setShowStickyHeader(true);
        }, 300);
    }
  }, []);

  const handleEventSelect = useCallback((event) => {
    handleNavigation(() => {
        setCurrentView('timetable');
        setSelectedEvent(event);
        const datesForEvent = timetableData.filter(item => item.event === event && item.date !== 'N/A').map(item => item.date);
        const firstDateForEvent = [...new Set(datesForEvent)].sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b))[0];
        setSelectedDate(firstDateForEvent || 'all-performances');
    });
  }, [timetableData, handleNavigation]);

  const handleFavoritesSelect = useCallback(() => {
    handleNavigation(() => {
        setCurrentView('favorites');
        setSelectedEvent(null); 
        setSelectedDate('favorites-view');
    });
  }, [handleNavigation]);
  
  const handleBlockTimetableSelect = useCallback(() => {
    handleNavigation(() => {
        setCurrentView('block');
        if (!selectedEvent && uniqueEvents.length > 0) {
            setSelectedEvent(uniqueEvents[0]);
        }
    });
  }, [selectedEvent, uniqueEvents, handleNavigation]);
  
  const handleStickyLogoClick = useCallback(() => {
    setIsInitialLoad(true);
    setSelectedEvent(null);
    setSelectedDate(null);
    setSearchTerm('');
    setShowStickyHeader(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStickyNav = useCallback((action) => {
    handleNavigation(action, true);
  }, [handleNavigation]);

  const showMessageBox = useCallback((message, action = null, actionButtonText = '') => {
    setMessageBoxContent(message);
    setMessageBoxAction(() => action);
    setMessageBoxActionButtonText(actionButtonText);
    setMessageBoxShow(true);
  }, []);

  const closeMessageBox = useCallback(() => setMessageBoxShow(false), []);

  const openContentPopup = useCallback((type, data) => {
    let finalData = data;
    if (type === 'iframe' && typeof data === 'string' && data.startsWith('http')) {
        try {
            const url = new URL(data);
            url.searchParams.set('ctf_app', '1'); 
            finalData = url.href;
        } catch (e) { console.error("Invalid URL for iframe:", data, e); }
    }
    setPopupContent({ type, data: finalData });
    setShowPopup(true);
  }, []); 

  const closePopup = useCallback(() => setShowPopup(false), []); 

  useEffect(() => {
    document.body.style.overflow = (showPopup || showPrivacyPolicy || messageBoxShow) ? 'hidden' : '';
    return () => document.body.style.overflow = '';
  }, [showPopup, showPrivacyPolicy, messageBoxShow]);

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('ctfTimetableFavorites'));
      if (storedFavorites) setFavorites(new Set(storedFavorites));

      const storedSubs = JSON.parse(localStorage.getItem('ctfNotificationSubscriptions'));
      if (storedSubs) setNotificationSubscriptions(new Set(storedSubs));
      
      const storedCustomNotifs = JSON.parse(localStorage.getItem('ctfScheduledCustomNotifications'));
       if (storedCustomNotifs) setScheduledCustomNotifications(new Set(storedCustomNotifs));

    } catch (e) { console.error("Fout bij laden uit localStorage:", e); }
  }, []);

  useEffect(() => { localStorage.setItem('appLanguage', language); }, [language]);

  useEffect(() => {
    window.openPerformancePopupFromNative = (title, url) => openContentPopup('iframe', url);
    return () => {
      delete window.openPerformancePopupFromNative;
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
    };
  }, [openContentPopup]); 

  useEffect(() => {
    if (!window.AndroidBridge && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
  }, []); 

  const handleLanguageChange = () => setLanguage(prev => prev === 'nl' ? 'en' : 'nl');

  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2IpMrUJ8Jyfq1xtIbioh7L0-9SQ4mLo_kOdLnvt2EWXNGews64jMTFHAegaAQ1ZF3pQ4HC_0Kca4D/pub?output=csv';

  const parseCsvLine = (line) => {
    const cells = []; let inQuote = false; let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) inQuote = !inQuote;
      else if (char === ',' && !inQuote) { cells.push(currentCell.replace(/""/g, '"').trim()); currentCell = ''; } 
      else currentCell += char;
    }
    cells.push(currentCell.replace(/""/g, '"').trim());
    return cells;
  };

  const fetchTimetableData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
        const response = await fetch(googleSheetUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();

        const lines = csvText.split(/\r?\n/).slice(1).filter(line => line.trim() !== '');
        let allParsedData = [];
        const localEventInfoMap = {};
        const customNotificationsToSchedule = [];

        for (let i = 0; i < lines.length; i++) {
            const cells = parseCsvLine(lines[i]);
            if (cells.length < 25) continue;

            const [
                date, time, title, genre, url, event, sponsorLogoUrl,
                pwycLink, location, googleMapsUrl, mapNumber, mapImageUrl,
                wheelchair, children, dutch, english, dialogue, dining,
                crowd, ngt, calm, , , notificationDate, notificationText
            ] = cells.map(cell => cell || '');

            if (notificationDate && notificationText) {
                customNotificationsToSchedule.push({
                    date: notificationDate,
                    time: "17:00", // Fixed time
                    text: notificationText,
                    id: `custom-notif-row-${i}` 
                });
            }

            if (event) {
                if (!localEventInfoMap[event]) localEventInfoMap[event] = {};
                const itemDate = parseDateForSorting(date);
                if (!isNaN(itemDate.getTime())) {
                    if (!localEventInfoMap[event].dateString || itemDate < parseDateForSorting(localEventInfoMap[event].dateString)) {
                        localEventInfoMap[event].dateString = date;
                    }
                }
                if (mapImageUrl && !localEventInfoMap[event].mapUrl) localEventInfoMap[event].mapUrl = mapImageUrl;
                if (sponsorLogoUrl && !localEventInfoMap[event].sponsorLogo) localEventInfoMap[event].sponsorLogo = sponsorLogoUrl;
            }

            allParsedData.push({
                id: `${event}-${date}-${time}-${title}`, date, time, title, location, url, event,
                googleMapsUrl, pwycLink, mapNumber, mapImageUrl, genre, isCalmRoute: calm.toLowerCase() === 'x',
                crowdLevel: crowd,
                safetyInfo: {
                    wheelchairAccessible: wheelchair.toLowerCase() === 'x',
                    suitableForChildren: children.toLowerCase() === 'x',
                    dutchLanguage: dutch.toLowerCase() === 'x',
                    englishLanguage: english.toLowerCase() === 'x',
                    dialogueFree: dialogue.toLowerCase() === 'x',
                    diningFacility: dining.toLowerCase() === 'x',
                    hasNGT: ngt.toLowerCase() === 'x',
                },
            });
        }
        
        setEventInfoMap(localEventInfoMap);
        setCustomNotifications(customNotificationsToSchedule);

        const now = new Date();
        const cutoffTime = new Date(now.getTime() - 30 * 60 * 1000);
        const filteredDataForDisplay = allParsedData.filter(item => {
            const perfDate = parseDateForSorting(item.date);
            if(isNaN(perfDate.getTime()) || !item.time) return true;
            const [h, m] = item.time.split(':');
            perfDate.setHours(h, m, 0, 0);
            return perfDate >= cutoffTime;
        });

        setTimetableData(filteredDataForDisplay);
        
        const uniqueEventsForDisplay = [...new Set(allParsedData.map(item => item.event).filter(Boolean))];
        setUniqueEvents(uniqueEventsForDisplay.sort((a,b) => (parseDateForSorting(localEventInfoMap[a]?.dateString) || 0) - (parseDateForSorting(localEventInfoMap[b]?.dateString) || 0)));
        
    } catch (err) {
      console.error("Fout bij het ophalen/parsen van gegevens:", err);
      setError(translations[language].common.errorLoading);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => { fetchTimetableData(); }, [fetchTimetableData]);

  useEffect(() => {
      if (loading || customNotifications.length === 0 || !language) return;
      customNotifications.forEach(async (notif) => {
          if (scheduledCustomNotifications.has(notif.id)) return;
          const notificationDate = parseDateForSorting(notif.date);
          if (isNaN(notificationDate.getTime())) return;
          const [h, m] = notif.time.split(':');
          notificationDate.setHours(h, m, 0, 0);
          if (notificationDate < new Date()) return;
          
          const title = translations[language].common.genericNotificationTitle;
          const body = notif.text;
          
          if (window.AndroidBridge?.scheduleNativeNotification) {
              // Native schedule logic
          } else if ('Notification' in window && Notification.permission === 'granted') {
              // Web schedule logic
          } else { return; }
          
          setScheduledCustomNotifications(prev => {
              const newSet = new Set(prev).add(notif.id);
              localStorage.setItem('ctfScheduledCustomNotifications', JSON.stringify([...newSet]));
              return newSet;
          });
      });
  }, [customNotifications, scheduledCustomNotifications, language, loading, translations]);

  useEffect(() => {
    if (selectedEvent && eventInfoMap[selectedEvent]) {
      const info = eventInfoMap[selectedEvent];
      setCurrentSponsorInfo({ logoUrl: info.sponsorLogo || '', eventName: selectedEvent });
    } else {
      setCurrentSponsorInfo(null);
    }
  }, [selectedEvent, eventInfoMap]);

  const formattedData = useMemo(() => {
    let sourceData;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    if (currentView === 'favorites') {
        sourceData = timetableData.filter(item => favorites.has(item.id));
    } else if (searchTerm) {
        sourceData = timetableData.filter(item => 
            item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
            item.location.toLowerCase().includes(lowerCaseSearchTerm)
        );
    } else if (selectedEvent) {
        if (selectedDate === 'calm-route') {
            sourceData = timetableData.filter(item => item.event === selectedEvent && item.isCalmRoute);
        } else if (selectedDate === 'all-performances') {
            const uniqueTitles = new Map();
            timetableData.filter(item => item.event === selectedEvent).forEach(item => {
                if (!uniqueTitles.has(item.title)) uniqueTitles.set(item.title, item);
            });
            sourceData = [...uniqueTitles.values()];
        } else {
            sourceData = timetableData.filter(item => item.event === selectedEvent && item.date === selectedDate);
        }
    } else {
        return [];
    }
    
    if (sourceData.length === 0) return [];

    if ((currentView === 'favorites' && favoritesViewMode === 'card') || searchTerm) {
        const groupedByEvent = sourceData.reduce((acc, item) => {
            (acc[item.event] = acc[item.event] || []).push(item);
            return acc;
        }, {});
        return Object.keys(groupedByEvent).sort().map(eventName => {
            const itemsForEvent = groupedByEvent[eventName];
            const groupedByDate = itemsForEvent.reduce((acc, item) => {
                (acc[item.date] = acc[item.date] || []).push(item);
                return acc;
            }, {});
            return {
                groupTitle: eventName,
                subGroups: Object.keys(groupedByDate).sort((a,b) => parseDateForSorting(a) - parseDateForSorting(b)).map(date => ({
                    subGroupTitle: date,
                    items: groupedByDate[date].sort((a, b) => a.time.localeCompare(b.time))
                }))
            };
        });
    }

    let groupTitle = null;
    if (selectedDate === 'calm-route') {
        groupTitle = `${translations[language].common.calmRoute} - ${selectedEvent}`;
    }

    const groupedByDate = sourceData.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
    }, {});
    
    return [{
      groupTitle,
      subGroups: Object.keys(groupedByDate).sort((a,b) => parseDateForSorting(a) - parseDateForSorting(b)).map(date => ({
        subGroupTitle: selectedDate === 'calm-route' ? date : null,
        items: groupedByDate[date].sort((a, b) => selectedDate === 'all-performances' ? a.title.localeCompare(b.title) : a.time.localeCompare(b.time))
      }))
    }];
  }, [searchTerm, currentView, selectedEvent, selectedDate, timetableData, favorites, language, translations, favoritesViewMode]);

  const datesForCurrentSelectedEvent = useMemo(() => {
    if (currentView === 'favorites' || !selectedEvent) return [];
    return [...new Set(timetableData.filter(item => item.event === selectedEvent && item.date).map(item => item.date))]
           .sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
  }, [timetableData, selectedEvent, currentView]);

  const visibleDatesForEvent = datesForCurrentSelectedEvent.slice(0, 5);
  const hiddenDatesForEvent = datesForCurrentSelectedEvent.slice(5);

  const scheduleActualNotification = useCallback(async (item) => {
    const eventTime = parseDateForSorting(item.date);
    if(isNaN(eventTime.getTime())) return;
    const [h, m] = item.time.split(':');
    eventTime.setHours(h, m, 0, 0);

    const notificationTime = new Date(eventTime.getTime() - 20 * 60 * 1000); 
    if (notificationTime < new Date()) {
      setNotificationSubscriptions(prev => {
        const newState = new Set(prev);
        if(newState.delete(item.id)) localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify([...newState]));
        return newState;
      });
      return;
    }
    
    if (window.AndroidBridge?.scheduleNativeNotification) {
      const canSchedule = await window.AndroidBridge.canScheduleExactAlarms();
      if(!canSchedule) {
        showMessageBox(translations[language].common.exactAlarmPermissionNeededBody, () => window.AndroidBridge.openExactAlarmSettings(), translations[language].common.openSettings);
        return;
      }
      window.AndroidBridge.scheduleNativeNotification(translations[language].common.notificationTitle, translations[language].common.notificationBody.replace('%s', item.title).replace('%s', item.location), notificationTime.getTime(), item.id, item.url);
    } else if ('Notification' in window && Notification.permission === 'granted') {
      const tag = `notification-${item.id}`;
      if (notificationTimeouts.current[tag]) clearTimeout(notificationTimeouts.current[tag]);
      notificationTimeouts.current[tag] = setTimeout(() => {
        new Notification(translations[language].common.notificationTitle, { body: translations[language].common.notificationBody.replace('%s', item.title).replace('%s', item.location), icon: 'Logo_Web_Trans_Wit.png', tag });
        setNotificationSubscriptions(prev => { const s = new Set(prev); s.delete(item.id); localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify([...s])); return s; });
      }, notificationTime.getTime() - Date.now());
    } else {
        showMessageBox(`Notificaties niet ondersteund of geweigerd.`);
    }
  }, [language, translations, showMessageBox]);

  const cancelScheduledNotification = useCallback((performanceId) => {
    if (window.AndroidBridge?.cancelNativeNotification) {
        window.AndroidBridge.cancelNativeNotification(performanceId);
    } else {
        const tag = `notification-${performanceId}`;
        if (notificationTimeouts.current[tag]) {
            clearTimeout(notificationTimeouts.current[tag]);
            delete notificationTimeouts.current[tag];
        }
    }
  }, []);

  const toggleFavorite = useCallback((itemObject, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemObject.id)) newFavorites.delete(itemObject.id);
      else newFavorites.add(itemObject.id);
      localStorage.setItem('ctfTimetableFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const toggleNotificationSubscription = useCallback((itemObject, e) => {
      e.stopPropagation();
      setNotificationSubscriptions(prev => {
          const newSubs = new Set(prev);
          if (newSubs.has(itemObject.id)) {
              newSubs.delete(itemObject.id);
              cancelScheduledNotification(itemObject.id);
          } else {
              newSubs.add(itemObject.id);
              scheduleActualNotification(itemObject);
          }
          localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify([...newSubs]));
          return newSubs;
      });
  }, [scheduleActualNotification, cancelScheduledNotification]);

  const addToGoogleCalendar = useCallback((e, title, date, time, location) => {
    e.stopPropagation();
    const startDate = parseDateForSorting(date);
    if (isNaN(startDate.getTime())) return;
    const [h,m] = time.split(':');
    startDate.setUTCHours(h, m);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    const format = d => d.toISOString().replace(/[:-]\d\d\.\d{3}Z$/, '').replace(/[-:]/g,'');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(startDate)}/${format(endDate)}&details=${encodeURIComponent('Locatie: ' + location)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(url, '_blank');
  }, []);

  const handleIconMouseEnter = useCallback((e, content) => {
    setCustomTooltipContent(content);
    setCustomTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
    setShowCustomTooltip(true);
  }, []);

  const handleIconMouseLeave = useCallback(() => setShowCustomTooltip(false), []);
  
  const renderMainContent = () => {
      if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
      }
      
      return (
        <div className="w-full">
            {(selectedEvent || currentView === 'favorites' || currentView === 'block') && (
                <>
                  <SponsorDisplay ref={sponsorRef} sponsorInfo={currentSponsorInfo} language={language} translations={translations} />
                  
                  {currentView === 'timetable' && !searchTerm && (
                      <DateNavigation loading={loading} error={error} datesForCurrentSelectedEvent={datesForCurrentSelectedEvent} visibleDatesForEvent={visibleDatesForEvent} hiddenDatesForEvent={hiddenDatesForEvent} showMoreDates={showMoreDates} setShowMoreDates={setShowMoreDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setSearchTerm={setSearchTerm} translations={translations} language={language} currentView={currentView} timetableData={timetableData} selectedEvent={selectedEvent} />
                  )}

                  {currentView === 'timetable' && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} translations={translations} language={language} />}
                  
                  {currentView === 'timetable' && (
                     <TimetableDisplay loading={loading} error={error} displayedData={formattedData} currentView={currentView} favorites={favorites} toggleFavorite={toggleFavorite} notificationSubscriptions={notificationSubscriptions} toggleNotificationSubscription={toggleNotificationSubscription} addToGoogleCalendar={addToGoogleCalendar} openContentPopup={openContentPopup} language={language} handleIconMouseEnter={handleIconMouseEnter} handleIconMouseLeave={handleIconMouseLeave} translations={translations} selectedEvent={selectedEvent} searchTerm={searchTerm} showMessageBox={showMessageBox} selectedDate={selectedDate} />
                  )}

                  {currentView === 'block' && (
                      <BlockTimetable allData={timetableData} favorites={favorites} selectedEvent={selectedEvent} setSelectedEventInBlock={(e) => handleStickyNav(() => setSelectedEvent(e))} uniqueEvents={uniqueEvents} openContentPopup={openContentPopup} translations={translations} language={language} />
                  )}

                  {currentView === 'favorites' && (
                      <>
                        <div className="flex justify-center gap-4 mt-8 mb-8">
                            <button onClick={() => setFavoritesViewMode('card')} className={`px-4 py-2 rounded-lg font-semibold ${favoritesViewMode === 'card' ? 'bg-[#1a5b64] text-white' : 'bg-white/30 text-white'}`}>
                                {translations[language].common.cardView}
                            </button>
                            <button onClick={() => setFavoritesViewMode('block')} className={`px-4 py-2 rounded-lg font-semibold ${favoritesViewMode === 'block' ? 'bg-[#1a5b64] text-white' : 'bg-white/30 text-white'}`}>
                                {translations[language].common.blockTimetable}
                            </button>
                        </div>
                        {favoritesViewMode === 'card' ? (
                             <TimetableDisplay loading={loading} error={error} displayedData={formattedData} currentView={currentView} favorites={favorites} toggleFavorite={toggleFavorite} notificationSubscriptions={notificationSubscriptions} toggleNotificationSubscription={toggleNotificationSubscription} addToGoogleCalendar={addToGoogleCalendar} openContentPopup={openContentPopup} language={language} handleIconMouseEnter={handleIconMouseEnter} handleIconMouseLeave={handleIconMouseLeave} translations={translations} selectedEvent={selectedEvent} searchTerm={searchTerm} showMessageBox={showMessageBox} selectedDate={selectedDate} />
                        ) : (
                            <BlockTimetable allData={timetableData} favorites={favorites} openContentPopup={openContentPopup} translations={translations} language={language} isFavoritesView={true} />
                        )}
                      </>
                  )}
                  
                  {currentView !== 'block' && selectedEvent && eventInfoMap[selectedEvent]?.mapUrl && !loading && !error && (
                      <div className="mt-8 mb-8 w-full max-w-sm px-4 cursor-pointer mx-auto" onClick={() => openContentPopup('image', eventInfoMap[selectedEvent].mapUrl)}>
                          <h2 className="text-center text-white text-2xl font-bold mb-4">{translations[language].common.mapTitle.replace('%s', selectedEvent)}</h2>
                          <img src={eventInfoMap[selectedEvent].mapUrl} alt={`[Afbeelding van Kaart ${selectedEvent}]`} className="w-full h-auto rounded-lg shadow-lg border-4 border-white/50 hover:border-white transition-all"/>
                      </div>
                  )}
                  {!loading && !error && !searchTerm &&(
                    <div className="mt-8 mb-24 w-full max-w-[15.75rem] px-4 cursor-pointer mx-auto" onClick={() => openContentPopup('text', translations[language].payWhatYouCan)}>
                      <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Afbeelding_van_WhatsApp_op_2025-06-24_om_11.16.13_85e74e32-removebg-preview.png" alt="[Afbeelding van Pay What You Can tekst]" className="w-full h-auto"/>
                    </div>
                  )}
                </>
            )}
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#20747f] font-sans text-gray-100 flex flex-col items-center relative overflow-x-hidden">
      <style>{`
        @keyframes slide-out-up {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-50px); opacity: 0; }
        }
        @keyframes slide-in-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-out {
          animation: slide-out-up 0.3s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
      
      <StickyHeader isVisible={showStickyHeader} uniqueEvents={uniqueEvents} handleEventClick={(e) => handleStickyNav(() => {setCurrentView('timetable'); setSelectedEvent(e);})} handleFavoritesClick={() => handleStickyNav(() => setCurrentView('favorites'))} handleBlockTimetableClick={() => handleStickyNav(() => setCurrentView('block'))} onLogoClick={handleStickyLogoClick} selectedEvent={selectedEvent} currentView={currentView} language={language} handleLanguageChange={handleLanguageChange} translations={translations} />
      
      <div className="w-full flex-grow relative">

        {/* Initial View */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isInitialLoad ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="w-full h-full flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className={`fixed inset-x-0 bottom-0 z-0 transition-opacity duration-700 ${isInitialLoad ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="relative w-full max-w-2xl mx-auto">
                <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/CTF-2025-campagnebeeld-zonder-achtergrond-scaled.png" alt="[Afbeelding van campagnebeeld sfeer]" className="w-full h-auto pointer-events-none" />
              </div>
            </div>
            <div className="relative z-10 w-full">
              <div className="absolute top-12 left-4">
                  <button onClick={() => setShowPrivacyPolicy(true)} className="px-3 py-1 h-8 sm:h-10 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-sm font-semibold">
                    {translations[language].common.privacyPolicy}
                  </button>
              </div>
              <TopRightControls language={language} handleLanguageChange={handleLanguageChange} />
              
              <AppHeader translations={translations} language={language} titleRef={titleRef} />
              {!loading && (
                <div>
                  <EventNavigation onEventSelect={handleEventSelect} onFavoritesSelect={handleFavoritesSelect} onBlockTimetableSelect={handleBlockTimetableSelect} uniqueEvents={uniqueEvents} language={language} translations={translations} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content View */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isInitialLoad ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <div key={contentKey} id="main-content-area" className={`w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 ${showStickyHeader ? 'pt-24 sm:pt-20' : ''} ${animationClass}`}>
            {renderMainContent()}
          </div>
        </div>
      </div>

      <PopupModal showPopup={showPopup} closePopup={closePopup} popupContent={popupContent} language={language} translations={translations} />
      <PrivacyPolicyModal showPrivacyPolicy={showPrivacyPolicy} setShowPrivacyPolicy={setShowPrivacyPolicy} language={language} renderPrivacyPolicyContent={renderPrivacyPolicyContent} translations={translations} />
      <CustomTooltip showCustomTooltip={showCustomTooltip} customTooltipContent={customTooltipContent} customTooltipPosition={customTooltipPosition} />
      <MessageBox message={messageBoxContent} show={messageBoxShow} onClose={closeMessageBox} onAction={messageBoxAction} actionButtonText={messageBoxActionButtonText} />
      <FooterButtons openContentPopup={openContentPopup} language={language} translations={translations} showPopup={showPopup} showStickyHeader={showStickyHeader}/>
    </div>
  );
};

export default App;
