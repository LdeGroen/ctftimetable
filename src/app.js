import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ========= NIEUW: Error Boundary Component =========
// Dit component vangt JavaScript-fouten overal in de app op.
// In plaats van een wit scherm, toont het een duidelijke foutmelding.
// Dit is essentieel voor het debuggen op apparaten zoals een tablet.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Werk de state bij zodat de volgende render de fallback UI toont.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Je kunt de fout ook loggen naar een externe service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Je kunt hier een eigen fallback UI renderen
      return (
        <div style={{ padding: '20px', color: 'black', backgroundColor: 'white', height: '100vh' }}>
          <h1>Oeps, er is iets misgegaan.</h1>
          <p>Probeer de app opnieuw te laden.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}


// Functie om datumstring te parsen naar een Date-object voor vergelijking en weergave
// ========= FIX: Aangepast om lokale tijdzone te gebruiken i.p.v. UTC =========
const parseDateForSorting = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return new Date(NaN);
  
  const trimmedDateString = dateString.trim();
  let day, month, year;

  // Poging 1: "dd-mm-yyyy"
  let [d, m, y] = trimmedDateString.split('-');
  if (d && m && y && !isNaN(parseInt(m, 10))) {
    day = parseInt(d, 10);
    month = parseInt(m, 10);
    year = parseInt(y, 10);
    // FIX: Gebruik lokale tijdzone i.p.v. Date.UTC
    return new Date(year, month - 1, day);
  }
  
  // Maandnamen voor parsing
  const monthNames = {
    'januari': 1, 'jan': 1,
    'februari': 2, 'feb': 2,
    'maart': 3, 'mrt': 3,
    'april': 4, 'apr': 4,
    'mei': 5,
    'juni': 6, 'jun': 6,
    'juli': 7, 'jul': 7,
    'augustus': 8, 'aug': 8,
    'september': 9, 'sep': 9,
    'oktober': 10, 'okt': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };

  // Poging 2: "d maand<y_bin_46>
  const parts = trimmedDateString.split(' ');
  if (parts.length === 3 && parts[1]) {
    day = parseInt(parts[0], 10);
    const monthNum = monthNames[parts[1].toLowerCase()];
    year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthNum && !isNaN(year)) {
      // FIX: Gebruik lokale tijdzone i.p.v. Date.UTC
      return new Date(year, monthNum - 1, day);
    }
  }

  // Poging 3: Fallback naar de native Date parser
  const parsedDate = new Date(trimmedDateString);
  if (!isNaN(parsedDate.getTime())) {
      // FIX: Retourneer direct de geparste datum (die al lokaal is)
      return parsedDate;
  }

  // Als niets werkt, retourneer een ongeldige datum
  return new Date(NaN);
};


// Vertalingen voor de app
const translations = {
  nl: {
    common: {
      timetable: 'Timetable',
      blockTimetable: 'Blokkenschema',
      favorites: 'Favorieten',
      searchPlaceholder: 'Zoek op artiest, titel of locatie...',
      moreDates: 'Meer dagen',
      lessDates: 'Minder dagen',
      loading: 'Timetable wordt ingeladen...',
      errorOops: 'Oeps, er ging iets mis!',
      errorLoading: 'Fout bij het laden van de dienstregeling. Probeer het later opnieuw of controleer de URL/sheet-structuur.',
      errorTimeout: 'De verbinding duurde te lang. Controleer je internetverbinding en probeer het opnieuw.',
      offlineIndicator: 'Offline modus: de getoonde gegevens zijn mogelijk verouderd.',
      tryAgain: 'Opnieuw proberen',
      noFavoritesFound: 'Geen favoriete voorstellingen gevonden.',
      noSearchResults: 'Geen resultaten gevonden voor \'%s\'.',
      noDataFound: 'Geen dienstregelinggegevens gevonden voor %s.',
      moreInfo: 'Meer info',
      addToFavorites: 'Voeg toe aan favorieten (ontvang herinnering)',
      removeFromFavorites: 'Verwijder van favorieten (annuleer herinnering)',
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
      location: 'Locatie',
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
      exactAlarmPermissionNeededTitle: 'Notificaties instellen',
      exactAlarmPermissionNeededBody: 'Voor betrouwbare herinneringen heeft de app de permissie "Wekkers en herinneringen" nodig. Schakel deze in voor de beste ervaring.',
      openSettings: 'Instellingen',
      mapTitle: 'Kaart %s',
      allPerformances: 'Alle voorstellingen',
      calmRoute: 'Rustige route',
      proudMainSponsor: 'Is trotse hoofdsponsor van %s',
      chooseCity: 'Kies stad',
      cardView: 'Voorstellingen', 
      geannuleerd: 'Geannuleerd',
      vol: 'Vol',
      tooltipCrowdLevelCancelled: 'Deze voorstelling is helaas geannuleerd.',
      cancellationNotificationTitle: 'Voorstelling Geannuleerd',
      cancellationNotificationBody: 'Let op: %s is geannuleerd. Kijk in de app voor een alternatief!',
      fullNotificationTitle: 'Voorstelling Vol',
      fullNotificationBody: 'Let op: %s is nu vol. Kijk in de app voor een alternatief!',
      dontAskAgain: 'Niet meer vragen',
      later: 'Later',
      exportFavorites: 'Exporteer Favorieten',
      exportFavoritesTitle: 'Exporteer je favorieten',
      exportAs: 'Exporteer als...',
      export: 'Exporteer',
      exporting: 'Exporteren...',
      exportError: 'Fout bij exporteren. Probeer het opnieuw.',
      shareFavorites: 'Deel mijn CTF Favorieten!',
      shareAsImage: 'Afbeelding',
      shareAsLink: 'Deel als link',
      shareLinkTitle: 'Mijn CTF Favorieten',
      shareLinkBody: 'Hoi! Dit zijn mijn favoriete voorstellingen voor het Café Theater Festival. Open de link om ze te bekijken en te importeren in je eigen timetable app!',
      importFavorites: 'Importeer Favorieten',
      import: 'Importeer',
      cancel: 'Annuleren',
      favoritesFromFriend: 'Favorieten van een vriend',
      importSuccess: 'Favorieten van vriend succesvol geïmporteerd!',
      friendsFavorites: 'Favorieten van Vrienden',
      noFriendsFavoritesFound: 'Geen favorieten van vrienden gevonden.',
      removeFriendsFavorites: 'Verwijder favorieten van vrienden',
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

**Groen**= de verwachtte drukte bij deze voorstelling is normaal. Als je op tijd komt kun je waarschijnlijk een zitplekje vinden

**Oranje**= De verwachtte drukte bij deze voorstelling is druk. We verwachten dat een deel van het publiek moet staan bij deze voorstelling om het goed te kunnen zien

**Rood**= De verwachtte drukte bij deze voorstelling is erg druk. Kom op tijd, want het zou zo maar kunnen dat deze voorstelling vol raakt

**Rode balk met kruis**= Deze voorstelling zit vol! Je kunt nog wel naar een van de andere voorstellingen gaan`
    },
    calmRouteInfo: {
      title: 'Rustige Route',
      text: `Niet iedereen houdt van een druk en vol café en daarom hebben we de Rustige Route in het leven geroepen. Per festival zijn er twee voorstellingen waarbij het mogelijk is om een plek te reserveren, waardoor je verzekerd bent van een plaats. Daarnaast zullen de gekozen voorstellingen ook rustiger zijn dan sommige andere voorstellingen op het festival.

Let op: de voorstellingen in de rustige route zijn niet prikkel-arm. Vanwege het onvoorspelbare karakter van de caféruimte en het feit dat veel voorstellingen de hele ruimte gebruiken kunnen we bij geen enkel voorstelling een prikkel-arme omgeving garanderen.`,
      button: 'Reserveer een plekje'
    },
    privacyPolicyContent: `
      **Privacybeleid voor de Café Theater Festival Timetable App**

      *Laatst bijgewerkt: 30 juni 2025*

      Welkom bij de Café Theater Festival Timetable App. Deze app is ontworpen om u te helpen de timetable van het festival te bekijken, voorstellingen als favoriet te markeren, herinneringen in te stellen en evenementen aan uw agenda toe te voegen.

      Uw privacy is belangrijk voor ons. Dit privacybeleid beschrijft hoe wij informatie verzamelen, gebruiken en beschermen wanneer u onze app gebruikt.

      **1. Welke Informatie Verzamelen Wij?**

      Deze app is een statische webapplicatie die uitsluitend lokaal in uw browser (of via een WebView op Android) draait. Wij verzamelen geen persoonlijk identificeerbare informatie.

      - **Favoriete Voorstellingen**: Wanneer u een voorstelling als favoriet markeert, wordt deze informatie uitsluitend lokaal opgeslagen op uw apparaat in de lokale opslag van de browser (localStorage). Deze gegevens worden niet naar externe servers verzonden en zijn alleen toegankelijk voor u.
      - **Notificatietoestemming**: De app kan u om toestemming vragen om browsernotificaties te tonen voor herinneringen aan voorstellingen. Uw keuze wordt lokaal door uw browser beheerd en niet door ons verzameld of opgeslagen.
      - **Zoekopdrachten**: Zoektermen die u invoert, worden niet opgeslagen of verzonden. Ze worden alleen gebruikt om lokaal de timetable te filteren.

      **2. Hoe Gebruiken Wij Uw Informatie?**

      De lokaal opgeslagen informatie wordt alleen gebruikt om u een gepersonaliseerde ervaring binnen de app te bieden.

      **3. Delen van Uw Informatie**

      Wij delen uw informatie met niemand. Aangezien we geen persoonlijke informatie verzamelen, is er geen informatie om te delen.

      **4. Externe Links**

      Deze app bevat links naar externe websites (bijv. Google Calendar). Wanneer u op deze links klikt, verlaat u onze app. Wij zijn niet verantwoordelijk voor het privacybeleid van andere websites.

      **5. Beveiliging**

      Aangezien alle relevante gegevens lokaal op uw apparaat worden opgeslagen, zijn de beveiligingsrisico's minimaal.

      **6. Wijzigingen in Dit Privacybeleid**

      We kunnen dit privacybeleid van tijd tot tijd bijwerken. Wijzigingen zijn onmiddellijk van kracht nadat ze in de app zijn geplaatst.

      **7. Contact Met Ons Opnemen**

      Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via: Info@cafetheaterfestival.nl
    `
  },
  en: {
    common: {
      timetable: 'Timetable',
      blockTimetable: 'Block Schedule',
      favorites: 'Favorites',
      searchPlaceholder: 'Search by artist, title, or location...',
      moreDates: 'More days',
      lessDates: 'Fewer days',
      loading: 'Timetable is loading...',
      errorOops: 'Oops, something went wrong!',
      errorLoading: 'Error loading the timetable. Please try again later or check the URL/sheet structure.',
      errorTimeout: 'The connection timed out. Please check your internet connection and try again.',
      offlineIndicator: 'Offline mode: The data shown may be outdated.',
      tryAgain: 'Try again',
      noFavoritesFound: 'No favorite shows found.',
      noSearchResults: 'No results found for \'%s\'.',
      noDataFound: 'No timetable data found for %s.',
      moreInfo: 'More Info',
      addToFavorites: 'Add to favorites (get reminder)',
      removeFromFavorites: 'Remove from favorites (cancel reminder)',
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
      location: 'Location',
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
      exactAlarmPermissionNeededTitle: 'Set up Notifications',
      exactAlarmPermissionNeededBody: 'For reliable reminders, the app needs the "Alarms & reminders" permission. Please enable it for the best experience.',
      openSettings: 'Settings',
      mapTitle: 'Map %s',
      allPerformances: 'All performances',
      calmRoute: 'Calm Route',
      proudMainSponsor: 'Is proud main sponsor of %s',
      chooseCity: 'Choose city',
      cardView: 'Performances',
      geannuleerd: 'Cancelled',
      vol: 'Full',
      tooltipCrowdLevelCancelled: 'This performance has been cancelled.',
      cancellationNotificationTitle: 'Performance Cancelled',
      cancellationNotificationBody: 'Please note: %s has been cancelled. Check the app for an alternative!',
      fullNotificationTitle: 'Performance Full',
      fullNotificationBody: 'Please note: %s is now full. Check the app for an alternative!',
      dontAskAgain: 'Don\'t ask again',
      later: 'Later',
      exportFavorites: 'Export Favorites',
      exportFavoritesTitle: 'Export your favorites',
      exportAs: 'Export as...',
      export: 'Export',
      exporting: 'Exporting...',
      exportError: 'Error during export. Please try again.',
      shareFavorites: 'Share my CTF Favorites!',
      shareAsImage: 'Image',
      shareAsLink: 'Share as link',
      shareLinkTitle: 'My CTF Favorites',
      shareLinkBody: 'Hi! These are my favorite performances for the Café Theater Festival. Open the link to view them and import them into your own timetable app!',
      importFavorites: 'Import Favorites',
      import: 'Import',
      cancel: 'Cancel',
      favoritesFromFriend: 'A friend\'s favorites',
      importSuccess: 'Successfully imported friend\'s favorites!',
      friendsFavorites: 'Friends\' Favorites',
      noFriendsFavoritesFound: 'No friends\' favorites found.',
      removeFriendsFavorites: 'Remove friends\' favorites',
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

**Green**= The expected crowd for this performance is normal. If you arrive on time, you will probably find a seat

**Orange**= The expected crowd for this performance is busy. We expect some of the audience to stand to see it well

**Red**= The expected crowd for this performance is very busy. Arrive on time, as this performance might fill up

**Red bar with cross**= This performance is full! You can still go to one of the other performances`
    },
    calmRouteInfo: {
        title: 'Calm Route',
        text: `Not everyone enjoys a crowded and busy café, which is why we created the Calm Route. For each festival, there are two performances for which it is possible to reserve a spot, ensuring you have a seat. Additionally, the selected performances will also be quieter than some other performances at the festival.

Please note: the performances in the calm route are not low-stimulus. Due to the unpredictable nature of the café space and the fact that many performances use the entire space, we cannot guarantee a low-stimulus environment for any performance.`,
        button: 'Reserve a spot'
    },
    privacyPolicyContent: `
      **Privacy Policy for the Café Theater Festival Timetable App**

      *Last updated: June 30, 2025*

      Welcome to the Café Theater Festival Timetable App. This app is designed to help you view the festival timetable, mark performances as favorites, set reminders, and add events to your calendar.

      Your privacy is important to us. This privacy policy describes how we collect, use, and protect information when you use our app.

      **1. What Information Do We Collect?**

      This app is a static web application that runs exclusively locally in your browser (or via a WebView on Android). We do not collect any personally identifiable information.

      - **Favorite Performances**: When you mark a performance as a favorite, this information is stored exclusively locally on your device in the browser's local storage (localStorage). This data is not sent to external servers and is only accessible to you.
      - **Notification Permission**: The app may ask for your permission to display browser notifications for performance reminders. Your choice is managed locally by your browser and is not collected or stored by us.
      - **Search Queries**: Search terms you enter are not stored or sent. They are only used to filter the timetable locally.

      **2. How Do We Use Your Information?**

      The locally stored information is only used to provide you with a personalized experience within the app.

      **3. Sharing Your Information**

      We do not share your information with anyone. Since we do not collect any personal information, there is no information to share.

      **4. External Links**

      This app contains links to external websites (e.g., Google Calendar). When you click these links, you leave our app. We are not responsible for the privacy practices of other websites.

      **5. Security**

      Since all relevant data is stored locally on your device, the security risks are minimal.

      **6. Wijzigingen in Dit Privacybeleid**

      We may update this privacy policy from time to time. Changes are effective immediately after being posted in the app.

      **7. Contact Us**

      If you have questions about this privacy policy, you can contact us at: Info@cafetheaterfestival.nl
    `
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
        <button onClick={handleLanguageChange} className="px-3 py-1 h-8 sm:h-10 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-sm font-semibold">
            {language === 'nl' ? 'EN' : 'NL'}
        </button>
    </div>
);


// Component voor de app-header (logo, titel, taalwisselaar, privacybeleid)
const AppHeader = ({ titleRef, translations, language }) => (
  <div className="flex flex-col items-center w-full pt-16">
    <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Logo_Web_Trans_Wit.png" alt="[Afbeelding van Café Theater Festival Logo]" className="w-full max-w-[10rem] h-auto mb-4"/>
    <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 text-center drop_shadow-lg font-oswald">{translations[language].common.timetable}</h1>
  </div>
);

// Sticky Header component
const StickyHeader = ({ isVisible, uniqueEvents, handleEventClick, handleFavoritesClick, handleFriendsFavoritesClick, hasFriendsFavorites, selectedEvent, currentView, language, handleLanguageChange, translations, onLogoClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    let currentSelectionText = translations[language].common.chooseCity;
    if (currentView === 'favorites') currentSelectionText = translations[language].common.favorites;
    else if (currentView === 'friends-favorites') currentSelectionText = translations[language].common.friendsFavorites;
    else if (selectedEvent) currentSelectionText = selectedEvent;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
        };
        if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-24 sm:h-20 items-end justify-center bg-black/20 backdrop-blur-md rounded-b-xl px-4 shadow-lg pb-2">
                    <div className="absolute left-4 bottom-2">
                       <img onClick={onLogoClick} className="h-16 w-auto cursor-pointer" src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav-wit-1.png" alt="[Afbeelding van CTF Logo Favicon]"/>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="inline-flex justify-center w-full rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-white/30 text-sm font-medium text-white hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                {currentSelectionText}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-1/2 translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-[#1a5b64] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        {uniqueEvents.map(event => (<a href="#" key={event} onClick={(e) => { e.preventDefault(); handleEventClick(event); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center" role="menuitem">{event}</a>))}
                                        <div className="border-t border-white/20 my-1"></div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleFavoritesClick(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center" role="menuitem">{translations[language].common.favorites}</a>
                                        {hasFriendsFavorites && <a href="#" onClick={(e) => { e.preventDefault(); handleFriendsFavoritesClick(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-white hover:bg-[#20747f] text-center" role="menuitem">{translations[language].common.friendsFavorites}</a>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="absolute right-4 bottom-2 flex items-center space-x-2">
                        <button onClick={handleLanguageChange} className="px-3 py-1 h-8 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-xs font-semibold">{language === 'nl' ? 'EN' : 'NL'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Component voor de evenementnavigatiebalk op het startscherm
const EventNavigation = ({ onEventSelect, onFavoritesSelect, onFriendsFavoritesSelect, hasFriendsFavorites, uniqueEvents, language, translations, refProp }) => (
    <div ref={refProp} className="flex flex-wrap justify-center gap-4 mb-8 p-3 max-w-full">
        {uniqueEvents.map(event => (
            <button key={event} onClick={() => onEventSelect(event)} className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50">{event}</button>
        ))}
        <button onClick={onFavoritesSelect} className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50">{translations[language].common.favorites}</button>
        {hasFriendsFavorites && <button onClick={onFriendsFavoritesSelect} className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50">{translations[language].common.friendsFavorites}</button>}
    </div>
);

// Component voor de datumnavigatiebalk
const DateNavigation = ({ datesForCurrentSelectedEvent, selectedDate, setSelectedDate, setSearchTerm, translations, language, selectedEvent, timetableData }) => {
    const hasCalmRoutePerformances = useMemo(() => 
        timetableData.some(item => item.event === selectedEvent && item.isCalmRoute),
        [timetableData, selectedEvent]
    );
    
    return (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
            <button onClick={() => { setSelectedDate('all-performances'); setSearchTerm(''); }} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedDate === 'all-performances' ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}>{translations[language].common.allPerformances}</button>
            {datesForCurrentSelectedEvent.map(date => (<button key={date} onClick={() => { setSelectedDate(date); setSearchTerm(''); }} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedDate === date ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}>{date}</button>))}
            {hasCalmRoutePerformances && (<button onClick={() => { setSelectedDate('calm-route'); setSearchTerm(''); }} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedDate === 'calm-route' ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}>{translations[language].common.calmRoute}</button>)}
        </div>
    );
};

// SponsorDisplay component
const SponsorDisplay = React.forwardRef(({ sponsorInfo, language, translations }, ref) => {
    if (!sponsorInfo || !sponsorInfo.logoUrl) return <div ref={ref} className="h-12"></div>;

    return (
        <div ref={ref} className="flex flex-col items-center justify-center mt-12 mb-8 text-center">
            <img src={sponsorInfo.logoUrl} alt={`[Afbeelding van Logo ${sponsorInfo.eventName}]`} className="max-h-20 w-auto object-contain mb-2"/>
            <p className="text-white text-lg font-semibold">{translations[language].common.proudMainSponsor.replace('%s', sponsorInfo.eventName)}</p>
        </div>
    );
});

// Zoekbalk
const SearchBar = ({ searchTerm, setSearchTerm, translations, language }) => (
  <div className="w-full max-w-md mb-8 px-4 mx-auto">
    <input type="text" placeholder={translations[language].common.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1a5b64] focus:ring focus:ring-[#1a5b64] focus:ring-opacity-50 text-gray-800 shadow-md"/>
  </div>
);

// Component voor de view switcher (Card vs Block)
const EventViewSwitcher = ({ viewMode, setViewMode, language, translations, handleAnimatedUpdate }) => (
  <div className="flex justify-center gap-4 my-8">
    <button
      onClick={() => handleAnimatedUpdate(() => setViewMode('card'))}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${viewMode === 'card' ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}
    >
      {translations[language].common.cardView}
    </button>
    <button
      onClick={() => handleAnimatedUpdate(() => setViewMode('block'))}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${viewMode === 'block' ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}
    >
      {translations[language].common.blockTimetable}
    </button>
  </div>
);


// Voorstellingskaart
const PerformanceCard = ({ item, favorites, toggleFavorite, addToGoogleCalendar, openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations, showMessageBox, hideTime = false, isExportMode = false, isFriendsView = false }) => {
    const getCrowdLevelInfo = useCallback((level) => {
        const defaultInfo = { fullBar: false, position: '10%', tooltip: translations[language].common.tooltipCrowdLevelGreenFull, label: null, barClass: 'bg-gradient-to-r from-green-600 via-yellow-500 to-red-600' };
        switch (level?.toLowerCase()) {
            case 'oranje': case 'orange': return { ...defaultInfo, position: '50%', tooltip: translations[language].common.tooltipCrowdLevelOrangeFull };
            case 'rood': case 'red': return { ...defaultInfo, position: '90%', tooltip: translations[language].common.tooltipCrowdLevelRedFull };
            case 'vol': case 'full': return { ...defaultInfo, fullBar: true, label: language === 'nl' ? 'Vol' : 'Full', barClass: 'bg-red-600', tooltip: translations[language].common.tooltipCrowdLevelFull };
            case 'geannuleerd': case 'cancelled': return { ...defaultInfo, fullBar: true, label: translations[language].common.geannuleerd, barClass: 'bg-red-600', tooltip: translations[language].common.tooltipCrowdLevelCancelled };
            default: return defaultInfo;
        }
    }, [language, translations]);

    const crowdInfo = useMemo(() => item.crowdLevel ? getCrowdLevelInfo(item.crowdLevel) : null, [item.crowdLevel, getCrowdLevelInfo]);
    const isCancelled = item.crowdLevel?.toLowerCase() === 'geannuleerd' || item.crowdLevel?.toLowerCase() === 'cancelled';
    const isFull = item.crowdLevel?.toLowerCase() === 'vol' || item.crowdLevel?.toLowerCase() === 'full';
    const fullTitle = item.artist ? `${item.artist} - ${item.title}` : item.title;
    
    const handleShare = async (e, title, url) => {
        e.stopPropagation();
        const shareText = translations[language].common.shareBody.replace('%s', title);
        const shareData = { title, text: shareText, url: url || window.location.href };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return; 
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                 console.warn('navigator.share failed, trying clipboard fallback:', error);
            } else {
                return; // User cancelled share, do nothing.
            }
        }

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareData.url);
                showMessageBox(translations[language].common.shareSuccess);
            } else {
                 throw new Error('Clipboard API not available');
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
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
    
    const actionIcons = {
        favorite: { title: favorites.has(item.id) ? translations[language].common.removeFromFavorites : translations[language].common.addToFavorites, className: favorites.has(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400', fill: favorites.has(item.id) ? 'currentColor' : 'none', stroke: 'currentColor', path: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
        calendar: { title: translations[language].common.addToGoogleCalendar, className: 'text-gray-500 hover:text-gray-700', fill: 'none', stroke: 'currentColor', path: <g><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></g> },
        share: { title: translations[language].common.sharePerformance, className: 'text-gray-500 hover:text-gray-700', fill: 'none', stroke: 'currentColor', path: <g><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></g> },
    };

    return (
        <div className={`text-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 flex flex-col relative min-h-[180px] w-full md:w-[384px] bg-white ${isCancelled || isFull ? 'opacity-50' : 'hover:scale-105 hover:shadow-2xl cursor-pointer'}`} onClick={() => !isCancelled && !isFull && !isExportMode && openContentPopup('iframe', item.url)}>
            {!hideTime && <p className="text-xl font-bold text-gray-800 mb-2">{item.time}</p>}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2">
                <h3 className="text-lg font-semibold text-[#20747f] mb-2 sm:mb-0 sm:mr-4">{fullTitle}</h3>
                {item.genre && item.genre !== 'N/A' && (
                    <p className="text-md font-semibold text-gray-600 text-right flex-shrink-0 ml-4">{item.genre}</p>
                )}
            </div>
             <div className="flex items-start gap-x-6 mb-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{translations[language].common.location}</p>
                    <a href={item.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (!item.googleMapsUrl || isExportMode) e.preventDefault(); e.stopPropagation(); }} className={`flex items-center text-[#20747f] text-md font-semibold ${item.googleMapsUrl && !isExportMode ? 'hover:text-[#1a5b64] cursor-pointer' : 'cursor-default'} transition-colors duration-200`} title={item.googleMapsUrl ? translations[language].common.openLocationInGoogleMaps : ''}>
                        {item.location}
                        {item.googleMapsUrl && (
                            <span className="ml-1 text-[#20747f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                    {item.mapNumber && item.mapNumber !== 'N/A' && (<text x="12" y="10.5" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="9" fontWeight="bold">{item.mapNumber}</text>)}
                                </svg>
                            </span>
                        )}
                    </a>
                </div>
                {!hideTime && crowdInfo && (
                  <div className="flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); if (!isExportMode) openContentPopup('text', translations[language].crowdMeterInfo); }}>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{translations[language].common.crowdLevel}</p>
                    <div className={`relative w-full h-4 rounded-full ${crowdInfo.barClass}`} onMouseEnter={(e) => handleIconMouseEnter(e, crowdInfo.tooltip)} onMouseLeave={handleIconMouseLeave}>
                        {crowdInfo.fullBar ? (<div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-xs uppercase">{crowdInfo.label}</span></div>)
                        : (<div className="absolute top-0 w-2 h-full rounded-full bg-gray-800" style={{ left: crowdInfo.position, transform: 'translate(-50%, -50%)', top: '50%' }}></div>)}
                    </div>
                  </div>
                )}
            </div>
             {!isExportMode && (
                <div className="absolute top-4 right-4 flex flex-row space-x-2">
                    {!hideTime && !isCancelled && !isFull && !isFriendsView && Object.entries(actionIcons).map(([type, icon]) => {
                        const clickHandlers = { favorite: (e) => toggleFavorite(item, e), calendar: (e) => addToGoogleCalendar(e, fullTitle, item.date, item.time, item.location), share: (e) => handleShare(e, fullTitle, item.url) };
                        return (
                            <div key={type} className="cursor-pointer" onClick={clickHandlers[type]} title={icon.title}>
                               <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors duration-200 ${icon.className}`} viewBox="0 0 24 24" fill={icon.fill} stroke={icon.stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{icon.path}</svg>
                            </div>
                        );
                    })}
                    {isFriendsView && (
                         <div className="cursor-pointer" onClick={(e) => toggleFavorite(item, e)} title={actionIcons.favorite.title}>
                             <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors duration-200 ${actionIcons.favorite.className}`} viewBox="0 0 24 24" fill={actionIcons.favorite.fill} stroke={actionIcons.favorite.stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{actionIcons.favorite.path}</svg>
                         </div>
                    )}
                </div>
             )}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-4 border-t border-gray-200 w-full gap-4">
                <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                    {safetyIcons.map(icon => item.safetyInfo[icon.key] && (<span key={icon.key} className="text-gray-600 flex items-center" onMouseEnter={(e) => handleIconMouseEnter(e, icon.tooltip)} onMouseLeave={handleIconMouseLeave}><img src={icon.url} alt={icon.tooltip} className="h-6 w-auto inline-block"/></span>))}
                </div>
                {!isExportMode && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        {item.isCalmRoute && (<button onClick={(e) => { e.stopPropagation(); openContentPopup('calmRouteInfo', translations[language].calmRouteInfo);}} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm font-semibold text-center">{translations[language].common.calmRoute}</button>)}
                        {item.pwycLink && (<button onClick={(e) => { e.stopPropagation(); window.open(item.pwycLink, '_blank'); }} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm font-semibold text-center" title={translations[language].payWhatYouCan.title}>{translations[language].payWhatYouCan.title}</button>)}
                        <button onClick={(e) => { e.stopPropagation(); openContentPopup('iframe', item.url); }} className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm" disabled={!item.url || item.url === 'N/A'}>{translations[language].common.moreInfo}</button>
                    </div>
                )}
            </div>
        </div>
    );
};


// Component voor het weergeven van de dienstregeling of favorieten
const TimetableDisplay = React.forwardRef(({
  loading, error, displayedData, currentView, favorites, toggleFavorite,
  addToGoogleCalendar, openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations,
  selectedEvent, searchTerm, showMessageBox, selectedDate, isExportMode = false
}, ref) => {
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
            : currentView === 'friends-favorites'
            ? translations[language].common.noFriendsFavoritesFound
            : translations[language].common.noDataFound.replace('%s', (selectedEvent || ''))
          }
        </p>
      </div>
    );
  }

  const isAllPerformancesView = selectedDate === 'all-performances';
  const isFriendsView = currentView === 'friends-favorites';

  return (
    <div ref={ref} className="w-full max-w-6xl mx-auto">
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
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  subGroup.items.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-6 justify-items-center justify-center`}
              >
                {subGroup.items.map((item) => (
                  <PerformanceCard
                    key={item.id}
                    item={item}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    addToGoogleCalendar={addToGoogleCalendar}
                    openContentPopup={openContentPopup}
                    language={language}
                    handleIconMouseEnter={handleIconMouseEnter}
                    handleIconMouseLeave={handleIconMouseLeave}
                    translations={translations}
                    showMessageBox={showMessageBox}
                    hideTime={isAllPerformancesView}
                    isExportMode={isExportMode}
                    isFriendsView={isFriendsView}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});


// Vereenvoudigd Blokkenschema component
const BlockTimetable = React.forwardRef(({ allData, favorites, toggleFavorite, selectedEvent, openContentPopup, translations, language, isFavoritesView = false, isFriendsView = false, friendsFavorites = new Set(), isExportMode = false }, ref) => {
    const [selectedDay, setSelectedDay] = useState(null);

    const sourceData = useMemo(() => {
        if (isFavoritesView) return allData.filter(p => favorites.has(p.id));
        if (isFriendsView) return allData.filter(p => friendsFavorites.has(p.id));
        return allData;
    }, [isFavoritesView, isFriendsView, allData, favorites, friendsFavorites]);

    const eventPerformances = useMemo(() => 
        (isFavoritesView || isFriendsView) ? sourceData : sourceData.filter(p => p.event === selectedEvent), 
        [isFavoritesView, isFriendsView, sourceData, selectedEvent]
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
    }, [selectedEvent, availableDays, selectedDay, isFavoritesView, isFriendsView]);

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
            if (grid[p.location] && p.time) {
                const [h, m] = p.time.split(':').map(Number);
                const timeSlot = `${String(h).padStart(2, '0')}:${m < 30 ? '00' : '30'}`;
                if (grid[p.location][timeSlot] === null) {
                    grid[p.location][timeSlot] = p;
                }
            }
        });
        
        return { locations, timeSlots, grid };
    }, [selectedDay, eventPerformances]);
    
    if (!isFavoritesView && !isFriendsView && !selectedEvent) {
        return <div className="text-center text-white p-4">{translations[language].common.chooseCity}</div>
    }

    const renderCell = (performance) => {
        if (!performance) return null;

        const isCancelled = performance.crowdLevel?.toLowerCase() === 'geannuleerd' || performance.crowdLevel?.toLowerCase() === 'cancelled';
        const isFull = performance.crowdLevel?.toLowerCase() === 'vol' || performance.crowdLevel?.toLowerCase() === 'full';
        const isFavorite = favorites.has(performance.id);
        const fullTitle = performance.artist ? `${performance.artist} - ${performance.title}` : performance.title;

        let cellBgClass = isExportMode ? 'bg-[#2e9aaa]' : 'bg-[#1a5b64] hover:bg-[#2e9aaa]';
        let content = <>{fullTitle}</>;

        if (isCancelled) {
            cellBgClass = 'bg-gray-500 opacity-80';
            content = (
                <>
                    <span className="line-through">{fullTitle}</span>
                    <span className="block text-xs font-bold mt-1">{translations[language].common.geannuleerd}</span>
                </>
            );
        } else if (isFull) {
            cellBgClass = 'bg-red-500';
            content = (
                <>
                    <span>{fullTitle}</span>
                    <span className="block text-xs font-bold mt-1">{translations[language].common.vol}</span>
                </>
            );
        }
        
        return (
            <div 
                onClick={() => !isCancelled && !isExportMode && openContentPopup('iframe', performance.url)}
                className={`relative text-white text-xs p-2 rounded-md w-full h-full flex flex-col items-center justify-center text-center transition-colors ${!isCancelled && !isExportMode ? 'cursor-pointer' : ''} ${cellBgClass}`}
            >
                <div className="w-full pr-6">
                    {content}
                </div>
                {!isCancelled && !isFriendsView && (
                    <div
                        onClick={(e) => { if (!isExportMode) { e.stopPropagation(); toggleFavorite(performance, e); } }}
                        className={`absolute top-1 right-1 p-1 ${!isExportMode ? 'cursor-pointer' : 'pointer-events-none'}`}
                        title={!isExportMode ? (isFavorite ? translations[language].common.removeFromFavorites : translations[language].common.addToFavorites) : ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-white/70'}`} viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    const getEmptyMessage = () => {
      if (isFavoritesView) return translations[language].common.noFavoritesFound;
      if (isFriendsView) return translations[language].common.noFriendsFavoritesFound;
      return translations[language].common.noDataFound.replace('%s', selectedEvent);
    }

    return (
        <div ref={ref} className="w-full text-white">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
                {availableDays.length > 0 ? availableDays.map(day => (
                    <button 
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${selectedDay === day ? 'bg-[#1a5b64] text-white shadow-md' : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'}`}
                    >
                        {day}
                    </button>
                )) : <p>{getEmptyMessage()}</p>}
            </div>
            
            <div className={`transition-opacity duration-300 ${!selectedDay ? 'opacity-0' : 'opacity-100'}`}>
                {availableDays.length > 0 && selectedDay && (
                    <div className={`overflow-x-auto ${isExportMode ? 'bg-[#20747f]' : 'bg-black bg-opacity-20'} p-4 rounded-lg`}>
                        <div className="inline-grid gap-px" style={{ gridTemplateColumns: `100px repeat(${gridData.timeSlots.length}, 120px)` }}>
                            <div className="sticky top-0 left-0 bg-[#20747f] z-20"></div> 
                            {gridData.timeSlots.map(time => (
                                <div key={time} className="sticky top-0 text-center font-bold p-2 border-b border-white/20 bg-[#20747f] z-10">
                                    {time}
                                </div>
                            ))}
                            {gridData.locations.map((loc, locIndex) => (
                                <React.Fragment key={loc}>
                                    <div className="sticky left-0 p-2 font-bold bg-[#20747f] z-10 text-right pr-2 border-r border-white/20 flex items-center justify-end" style={{ gridRow: locIndex + 2 }}>
                                        <span>{loc}</span>
                                    </div>
                                    {gridData.timeSlots.map(time => {
                                        const performance = gridData.grid[loc]?.[time];
                                        return (
                                            <div key={`${loc}-${time}`} className="border-r border-b border-white/10 p-1 min-h-[60px] flex items-center justify-center">
                                                {renderCell(performance)}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});


// Component voor een inzoombare afbeelding
const ZoomableImage = ({ src, alt }) => {
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const isPinching = useRef(false);
    const lastPinchDist = useRef(0);
    const isDragging = useRef(false);
    const lastDragPos = useRef({ x: 0, y: 0 });

    const updateTransform = (newTransform, { clamp = true } = {}) => {
        setTransform(prev => {
            let { scale, x, y } = { ...prev, ...newTransform };
            
            if (clamp) {
                scale = Math.max(1, Math.min(scale, 5)); // Clamp scale between 1x and 5x
                
                if (scale === 1) {
                    x = 0;
                    y = 0;
                } else {
                    const imageEl = imageRef.current;
                    const containerEl = containerRef.current;
                    if (imageEl && containerEl) {
                        const max_x = (imageEl.offsetWidth * scale - containerEl.clientWidth) / 2;
                        const max_y = (imageEl.offsetHeight * scale - containerEl.clientHeight) / 2;
                        x = Math.max(-max_x, Math.min(x, max_x));
                        y = Math.max(-max_y, Math.min(y, max_y));
                    }
                }
            }
            return { scale, x, y };
        });
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const scaleDelta = e.deltaY * -0.01;
        updateTransform({ scale: transform.scale + scaleDelta });
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        lastDragPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const dx = e.clientX - lastDragPos.current.x;
        const dy = e.clientY - lastDragPos.current.y;
        lastDragPos.current = { x: e.clientX, y: e.clientY };
        updateTransform({ x: transform.x + dx, y: transform.y + dy });
    };

    const handleMouseUp = () => isDragging.current = false;

    const getDistance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            isPinching.current = true;
            lastPinchDist.current = getDistance(e.touches);
        } else if (e.touches.length === 1) {
            e.preventDefault();
            isDragging.current = true;
            lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    const handleTouchMove = (e) => {
        if (isPinching.current && e.touches.length === 2) {
            e.preventDefault();
            const newDist = getDistance(e.touches);
            const scaleDelta = (newDist - lastPinchDist.current) * 0.01;
            lastPinchDist.current = newDist;
            updateTransform({ scale: transform.scale + scaleDelta });
        } else if (isDragging.current && e.touches.length === 1) {
            e.preventDefault();
            const dx = e.touches[0].clientX - lastDragPos.current.x;
            const dy = e.clientY - lastDragPos.current.y;
            lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            updateTransform({ x: transform.x + dx, y: transform.y + dy });
        }
    };

    const handleTouchEnd = () => {
        isPinching.current = false;
        isDragging.current = false;
    };
    
    const handleDoubleClick = () => {
        updateTransform({ scale: transform.scale > 1 ? 1 : 2 });
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out"
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
            />
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
             const iframeSrc = typeof popupContent.data === 'string' ? popupContent.data.trim() : '';
             if (!iframeSrc) return (<div className="flex items-center justify-center h-full text-xl text-white">{translations[language].common.noContentAvailable}</div>);
             return <iframe src={iframeSrc} title="Meer informatie" className="w-full h-full border-0 rounded-b-lg"></iframe>;
        case 'image':
            const imgSrc = typeof popupContent.data === 'string' ? popupContent.data.trim() : '';
            if (!imgSrc) return (<div className="flex items-center justify-center h-full text-xl text-white">{translations[language].common.noContentAvailable}</div>);
            return <ZoomableImage src={imgSrc} alt="Kaart" />;
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
const MessageBox = ({ show, title, message, buttons }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
        {title && <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>}
        <div className="text-lg font-medium text-gray-800 mb-6">{message}</div>
        <div className="flex flex-col sm:flex-row-reverse justify-center space-y-2 sm:space-y-0 sm:space-x-reverse sm:space-x-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`font-bold py-2 px-4 rounded-lg transition duration-300 w-full sm:w-auto ${button.className || 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
const ExportModal = ({ show, onClose, onExport, language, translations, isExporting }) => {
    
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-gray-800">
                <h3 className="text-xl font-bold text-center mb-6">{translations.common.exportFavoritesTitle}</h3>
                
                <div className="space-y-4">
                    <button
                        onClick={() => onExport('image')}
                        disabled={isExporting}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                         {isExporting ? translations.common.exporting : translations.common.shareAsImage}
                    </button>
                    <button
                        onClick={() => onExport('link')}
                        disabled={isExporting}
                        className="w-full bg-[#20747f] hover:bg-[#1a5b64] text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isExporting ? translations.common.exporting : translations.common.shareAsLink}
                    </button>
                </div>

                 <button onClick={onClose} className="w-full mt-6 text-gray-600 hover:text-gray-800 font-semibold py-2">
                    {translations.common.close}
                </button>
            </div>
        </div>
    );
};

// Import Favorites Modal
const ImportFavoritesModal = ({ show, onClose, onImport, performances, language, translations }) => {
    if (!show || !performances || performances.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-gray-800 flex flex-col max-h-[80vh]">
                <h3 className="text-xl font-bold text-center mb-4">{translations.common.favoritesFromFriend}</h3>
                <div className="overflow-y-auto flex-grow mb-6 border-t border-b py-4">
                    <ul className="space-y-2">
                        {performances.map(item => (
                            <li key={item.id} className="p-2 bg-gray-100 rounded-md">
                                <p className="font-semibold text-[#20747f]">{item.artist ? `${item.artist} - ${item.title}` : item.title}</p>
                                <p className="text-sm text-gray-600">{item.date} - {item.time} @ {item.location}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-around gap-4">
                    <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300">
                        {translations.common.cancel}
                    </button>
                    <button onClick={onImport} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                        {translations.common.import}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ========= NIEUW: Offline Indicator Component =========
const OfflineIndicator = ({ isOffline, language, translations }) => {
  if (!isOffline) return null;
  return (
    <div className="fixed top-0 sm:top-20 left-0 right-0 bg-yellow-500 text-black text-center p-2 z-30 text-sm font-semibold shadow-lg">
      {translations[language].common.offlineIndicator}
    </div>
  );
};


// De hoofdcomponent van de app
const AppContent = () => { // Renamed from App to AppContent
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ type: null, data: null });
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('timetable'); 
  const [uniqueEvents, setUniqueEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [scheduledCustomNotifications, setScheduledCustomNotifications] = useState(new Set());
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'nl');
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);
  const [customTooltipContent, setCustomTooltipContent] = useState('');
  const [customTooltipPosition, setCustomTooltipPosition] = useState({ x: 0, y: 0 });
  const [messageBoxConfig, setMessageBoxConfig] = useState({ show: false, message: '', buttons: [], title: '' });
  const [permissionRequestDismissed, setPermissionRequestDismissed] = useState(false);
  const [eventInfoMap, setEventInfoMap] = useState({});
  const [currentSponsorInfo, setCurrentSponsorInfo] = useState(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [favoritesViewMode, setFavoritesViewMode] = useState('card');
  const [friendsFavoritesViewMode, setFriendsFavoritesViewMode] = useState('card');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [eventViewMode, setEventViewMode] = useState('card');
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfig, setExportConfig] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [friendsFavorites, setFriendsFavorites] = useState(new Set());
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [sharedFavoritesForImport, setSharedFavoritesForImport] = useState([]);

  const titleRef = useRef(null);
  const sponsorRef = useRef(null);
  const notificationTimeouts = useRef({});
  const prevTimetableDataRef = useRef([]);
  const exportCardViewRef = useRef(null);
  const exportBlockViewRef = useRef(null);
  
  const handleAnimatedUpdate = useCallback((updateFunction) => {
    setIsContentVisible(false);
    setTimeout(() => {
      updateFunction();
      setIsContentVisible(true);
    }, 300);
  }, []);

  const closeMessageBox = useCallback(() => setMessageBoxConfig(prev => ({ ...prev, show: false })), []);

  const showMessageBox = useCallback((message, buttons = [], title = '') => {
    const finalButtons = buttons.length > 0 ? buttons : [{ text: 'OK', onClick: closeMessageBox, className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' }];
    setMessageBoxConfig({ show: true, message, buttons: finalButtons, title });
  }, [closeMessageBox]);

  useEffect(() => {
    const scriptId = 'html-to-image-script';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const generateAndShareImage = useCallback(async (element) => {
      if (!element) {
          console.error("Export failed: element is null.");
          showMessageBox(translations[language].common.exportError);
          return;
      }
      try {
          document.body.style.backgroundColor = '#20747f';
          const options = { quality: 0.95, backgroundColor: '#20747f', cacheBust: true, imagePlaceholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', pixelRatio: 2 };
          const dataUrl = await window.htmlToImage.toPng(element, options);
          document.body.style.backgroundColor = '';

          if (window.AndroidBridge && window.AndroidBridge.shareImage) {
              const base64Data = dataUrl.split(',')[1];
              const title = translations[language].common.shareFavorites;
              const text = translations[language].common.shareFavorites;
              const filename = 'ctf-favorieten.png';
              window.AndroidBridge.shareImage(base64Data, filename, title, text);
          } else {
              const blob = await (await fetch(dataUrl)).blob();
              const file = new File([blob], 'ctf-favorieten.png', { type: 'image/png' });
              if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                  await navigator.share({ files: [file], title: translations[language].common.shareFavorites, text: translations[language].common.shareFavorites });
              } else {
                  const a = document.createElement('a');
                  a.href = dataUrl;
                  a.download = 'ctf-favorieten.png';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
              }
          }
      } catch (error) {
          console.error('Oops, something went wrong during export!', error);
          showMessageBox(translations[language].common.exportError);
          document.body.style.backgroundColor = '';
      }
  }, [language, translations, showMessageBox]);

  const handleExport = useCallback(async (type) => {
    if (type === 'link') {
        // Create a map for quick ID to index lookup
        const idToIndexMap = new Map(timetableData.map((item, index) => [item.id, index]));
        
        // Get indices for favorite IDs
        const favoriteIndices = Array.from(favorites)
            .map(id => idToIndexMap.get(id))
            .filter(index => index !== undefined); // Make sure we only have valid indices

        // Join indices and encode
        const encodedIndices = btoa(favoriteIndices.join(',')); 

        const publicBaseUrl = 'https://ldegroen.github.io/ctftimetable/';
        // Use a new, shorter query param
        const url = `${publicBaseUrl}?fav_indices=${encodedIndices}`;
        
        const shareData = {
            title: translations[language].common.shareLinkTitle,
            text: translations[language].common.shareLinkBody,
            url: url,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url);
                showMessageBox(translations[language].common.shareSuccess);
            }
        } catch (err) {
            console.error('Error sharing link:', err);
            showMessageBox(translations[language].common.shareError);
        }
        setShowExportModal(false);
    } else if (type === 'image') {
        setExportConfig({ type: favoritesViewMode });
    }
  }, [favorites, language, translations, showMessageBox, favoritesViewMode, timetableData]);

  useEffect(() => {
    if (!exportConfig) return;

    const doExport = async () => {
        setIsExporting(true);
        // Use a small timeout to allow the offscreen component to render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const elementRef = exportConfig.type === 'card' 
            ? exportCardViewRef.current 
            : exportBlockViewRef.current;
            
        if (elementRef && typeof window.htmlToImage !== 'undefined') {
            await generateAndShareImage(elementRef);
        } else {
            console.error("Export prerequisites not met. Element or htmlToImage missing.");
            showMessageBox(translations[language].common.exportError);
        }
        
        setIsExporting(false);
        setExportConfig(null);
        setShowExportModal(false);
    };

    doExport();
  }, [exportConfig, generateAndShareImage, language, translations, showMessageBox]);


  useEffect(() => {
    const handleScroll = () => {
        if (titleRef.current) {
            const { bottom } = titleRef.current.getBoundingClientRect();
            setShowStickyHeader(bottom < 80);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const returnToInitialView = useCallback(() => {
      setIsInitialLoad(true);
      setSelectedEvent(null);
      setSelectedDate(null);
      setSearchTerm('');
      setShowStickyHeader(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Maak de URL schoon
      try {
        window.history.replaceState({ view: 'initial' }, '', window.location.pathname + '#');
      } catch (e) {
        console.warn("Could not update history state:", e);
      }
  }, []);
  
  const handleViewChange = useCallback((view, event = null) => {
    setIsTransitioning(true);
    
    const updateUrl = () => {
        let hash = '#'; // Default hash
        if (view === 'timetable' && event) hash = `#${encodeURIComponent(event)}`;
        else if (view === 'favorites') hash = '#favorites';
        else if (view === 'friends-favorites') hash = '#friends-favorites';

        const newUrl = window.location.pathname + hash;
        const state = { view: 'detail', event, viewMode: 'card', currentView: view };

        try {
            window.history.replaceState(state, '', newUrl);
        } catch (e) {
            console.warn("Could not update history state:", e);
        }
    };
    
    updateUrl();

    setTimeout(() => {
        setCurrentView(view);
        setSelectedEvent(event);
        if (view === 'timetable') setEventViewMode('card');
        setIsInitialLoad(false);
        setShowStickyHeader(true);

        if (view === 'timetable' && event) {
            const datesForEvent = timetableData.filter(item => item.event === event && item.date !== 'N/A').map(item => item.date);
            const firstDateForEvent = [...new Set(datesForEvent)].sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b))[0];
            setSelectedDate(firstDateForEvent || 'all-performances');
        } else if (view === 'favorites') {
            setSelectedDate('favorites-view');
        } else if (view === 'friends-favorites') {
            setSelectedDate('friends-favorites-view');
        }
        
        requestAnimationFrame(() => {
             if (sponsorRef.current) {
                const headerEl = document.querySelector('.fixed.top-0');
                const headerHeight = headerEl ? headerEl.offsetHeight : 80;
                const elementTop = sponsorRef.current.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementTop - headerHeight - 10, behavior: 'auto' });
             } else {
                 window.scrollTo({ top: 0, behavior: 'auto'});
             }
             setIsTransitioning(false);
        });

    }, 300);
  }, [timetableData]);

  // NIEUWE FUNCTIE: Verwijder favorieten van vrienden
  const handleClearFriendsFavorites = useCallback(() => {
      setFriendsFavorites(new Set());
      localStorage.removeItem('ctfFriendsFavorites');
      returnToInitialView();
  }, [returnToInitialView]);


  const handleStickyLogoClick = useCallback(() => {
    returnToInitialView();
  }, [returnToInitialView]);

  useEffect(() => {
      const handlePopState = (event) => {
          const state = event.state;
          if (!state || state.view === 'initial') {
              returnToInitialView();
          } else if (state.view === 'detail') {
              setIsInitialLoad(false);
              setCurrentView(state.currentView || 'timetable');
              setSelectedEvent(state.event);
              if(state.currentView === 'timetable') setEventViewMode(state.viewMode || 'card');
              setShowStickyHeader(true);
          }
      };

      window.addEventListener('popstate', handlePopState);
      
      // Initial state setup based on URL hash AND query params
      const processUrl = () => {
        const hash = window.location.hash.substring(1);
        
        if (hash === 'favorites') {
            handleViewChange('favorites');
        } else if (hash === 'friends-favorites') {
            handleViewChange('friends-favorites');
        } else if (hash) {
            handleViewChange('timetable', decodeURIComponent(hash));
        } else {
            try {
                window.history.replaceState({ view: 'initial' }, '', window.location.pathname + '#');
            } catch (e) {
                console.warn("Could not update history state:", e);
            }
        }
      };
      
      // We call processUrl after the data is loaded inside the `init` useEffect
      // to ensure `handleViewChange` has access to the timetable data.

      return () => {
          window.removeEventListener('popstate', handlePopState);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ========= WIJZIGING: useEffect om notificatie data op te halen bij start =========
  useEffect(() => {
    // Deze functie wordt aangeroepen zodra de app is geladen.
    const checkForInitialNotification = () => {
      if (window.AndroidBridge && typeof window.AndroidBridge.getInitialNotificationData === 'function') {
        try {
          const jsonData = window.AndroidBridge.getInitialNotificationData();
          if (jsonData) {
            const data = JSON.parse(jsonData);
            if (data && data.url) {
              // We hebben data! Open de pop-up.
              console.log("Notificatie data ontvangen van native:", data);
              openContentPopup('iframe', data.url);
            }
          }
        } catch (e) {
          console.error("Fout bij het ophalen/parsen van initiële notificatie data:", e);
        }
      }
    };
    
    // Een kleine vertraging om zeker te zijn dat de bridge er is.
    const timer = setTimeout(checkForInitialNotification, 100);
    return () => clearTimeout(timer);
  }, [openContentPopup]);
  // =================================================================================

  useEffect(() => {
    const isModalOpen = showPopup || showPrivacyPolicy || messageBoxConfig.show || showExportModal || showImportPopup;
    const mainContentEl = document.getElementById('main-content-area');

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      if (mainContentEl) mainContentEl.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (mainContentEl) mainContentEl.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = '';
      if (mainContentEl) mainContentEl.style.overflow = 'auto';
    };
  }, [showPopup, showPrivacyPolicy, messageBoxConfig.show, showExportModal, showImportPopup]);

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('ctfTimetableFavorites'));
      if (storedFavorites) setFavorites(new Set(storedFavorites));

      const storedFriendsFavorites = JSON.parse(localStorage.getItem('ctfFriendsFavorites'));
      if (storedFriendsFavorites) setFriendsFavorites(new Set(storedFriendsFavorites));
      
      const storedCustomNotifs = JSON.parse(localStorage.getItem('ctfScheduledCustomNotifications'));
       if (storedCustomNotifs) setScheduledCustomNotifications(new Set(storedCustomNotifs));
       
      const dismissed = localStorage.getItem('ctfNotificationPermissionDismissed');
      if (dismissed === 'true') setPermissionRequestDismissed(true);

    } catch (e) { console.error("Fout bij laden uit localStorage:", e); }
  }, []);

  useEffect(() => { localStorage.setItem('appLanguage', language); }, [language]);

  useEffect(() => {
    // window.openPerformancePopupFromNative = (title, url) => openContentPopup('iframe', url);
    return () => {
      // delete window.openPerformancePopupFromNative;
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
    };
  }, [openContentPopup]); 

  useEffect(() => {
    try {
        if (window.AndroidBridge === undefined && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    } catch (e) {
        console.error("Error requesting notification permission:", e);
    }
  }, []); 

  const handleLanguageChange = () => setLanguage(prev => prev === 'nl' ? 'en' : 'nl');

  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2IpMrUJ8Jyfq1xtIbioh7L0-9SQ4mLo_kOdLnvt2EWXNGews64jMTFHAegaAQ1ZF3pQ4HC_0Kca4D/pub?output=csv';
  const gistNotificationsUrl = 'https://ldegroen.github.io/ctf-notificaties/notifications.json'; 

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconden time-out

    try {
        const response = await fetch(googleSheetUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();

        const lines = csvText.split(/\r?\n/).slice(1).filter(line => line.trim() !== '');
        let allParsedData = [];
        const localEventInfoMap = {};

        for (let i = 0; i < lines.length; i++) {
            const cells = parseCsvLine(lines[i]);
            if (cells.length < 22) continue;

            const [
                date, time, artist, title, genre, url, event, sponsorLogoUrl,
                pwycLink, location, googleMapsUrl, mapNumber, mapImageUrl,
                wheelchair, children, dutch, english, dialogue, dining,
                crowd, ngt, calm
            ] = cells.map(cell => cell || '');

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
                id: `${event}-${date}-${time}-${artist}-${title}`,
                date, time, artist, title, location, url, event,
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
        
        const uniqueEventsForDisplay = [...new Set(allParsedData.map(item => item.event).filter(Boolean))].sort((a,b) => (parseDateForSorting(localEventInfoMap[a]?.dateString) || 0) - (parseDateForSorting(localEventInfoMap[b]?.dateString) || 0));

        const now = new Date();
        const cutoffTime = new Date(now.getTime() - 30 * 60 * 1000);
        const filteredDataForDisplay = allParsedData.filter(item => {
            if (!item.date || !item.time) return true;
            const perfDate = parseDateForSorting(item.date);
            if(isNaN(perfDate.getTime())) return true;
            const [h, m] = item.time.split(':');
            perfDate.setHours(h, m, 0, 0);
            return perfDate >= cutoffTime;
        });

        setError(null);
        setIsOffline(false);
        setTimetableData(filteredDataForDisplay);
        setEventInfoMap(localEventInfoMap);
        setUniqueEvents(uniqueEventsForDisplay);
        
        localStorage.setItem('ctfTimetableCache', JSON.stringify({
            data: filteredDataForDisplay,
            eventInfoMap: localEventInfoMap,
            uniqueEvents: uniqueEventsForDisplay,
            timestamp: new Date().getTime()
        }));
        
        // Return data for import check
        return filteredDataForDisplay;

    } catch (err) {
        console.error("Fout bij het ophalen van gegevens:", err);
        
        if (timetableData.length > 0) {
            setIsOffline(true);
        } else {
            if (err.name === 'AbortError') {
                 setError(translations[language].common.errorTimeout);
            } else {
                 setError(translations[language].common.errorLoading);
            }
        }
        // Return existing data on error
        return timetableData;
    }
  }, [language, translations, timetableData]);

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        let dataFromCache = [];
        
        try {
            const cached = localStorage.getItem('ctfTimetableCache');
            if (cached) {
                const { data, eventInfoMap, uniqueEvents } = JSON.parse(cached);
                dataFromCache = data || [];
                setTimetableData(dataFromCache);
                setEventInfoMap(eventInfoMap || {});
                setUniqueEvents(uniqueEvents || []);
            }
        } catch (e) {
            console.error("Kon cache niet laden", e);
            localStorage.removeItem('ctfTimetableCache');
        }
        
        const fetchedData = await fetchTimetableData();
        const finalData = fetchedData.length > 0 ? fetchedData : dataFromCache;

        // Check for import URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const favoriteIndicesParam = urlParams.get('fav_indices');
        const favoriteIdsParam = urlParams.get('favorites'); // For backward compatibility

        let performancesToImport = [];

        if (favoriteIndicesParam) {
            try {
                const decodedIndices = atob(favoriteIndicesParam).split(',').map(Number);
                performancesToImport = decodedIndices.map(index => finalData[index]).filter(Boolean);
            } catch (e) {
                console.error("Error decoding favorite indices from URL", e);
            }
        } else if (favoriteIdsParam) {
            try {
                const decodedIds = atob(favoriteIdsParam).split(',');
                performancesToImport = finalData.filter(p => decodedIds.includes(p.id));
            } catch (e) {
                console.error("Error decoding favorite IDs from URL", e);
            }
        }

        if (performancesToImport.length > 0) {
            setSharedFavoritesForImport(performancesToImport);
            setShowImportPopup(true);
        } else {
            // If no import, process the hash for navigation
            const hash = window.location.hash.substring(1);
            if (hash === 'favorites') {
                handleViewChange('favorites');
            } else if (hash === 'friends-favorites') {
                handleViewChange('friends-favorites');
            } else if (hash) {
                handleViewChange('timetable', decodeURIComponent(hash));
            } else {
                try {
                    window.history.replaceState({ view: 'initial' }, '', window.location.pathname + '#');
                } catch (e) {
                    console.warn("Could not update history state:", e);
                }
            }
        }
        
        setLoading(false);
    };

    init();

    const intervalId = setInterval(fetchTimetableData, 120000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleImportFavorites = () => {
      const importedIds = new Set(sharedFavoritesForImport.map(p => p.id));
      setFriendsFavorites(importedIds);
      localStorage.setItem('ctfFriendsFavorites', JSON.stringify(Array.from(importedIds)));
      setShowImportPopup(false);
      setSharedFavoritesForImport([]);
      showMessageBox(translations[language].common.importSuccess);
      
      // The call to handleViewChange will update the URL and remove the query parameters.
      handleViewChange('friends-favorites');
  };

  const openSettingsWithFallback = useCallback(() => {
      try {
        if (window.AndroidBridge?.openExactAlarmSettings) {
            window.AndroidBridge.openExactAlarmSettings();
        } else if (window.AndroidBridge?.openAppSettings) {
            window.AndroidBridge.openAppSettings();
        }
      } catch (e) {
        console.error("Failed to open Android settings:", e);
      }
      closeMessageBox(); 
  }, [closeMessageBox]);
  
  const showPermissionDialog = useCallback(() => {
      showMessageBox(
        translations[language].common.exactAlarmPermissionNeededBody,
        [
          {
            text: translations[language].common.openSettings,
            onClick: openSettingsWithFallback,
            className: 'bg-[#20747f] hover:bg-[#1a5b64] text-white'
          },
          {
            text: translations[language].common.later,
            onClick: closeMessageBox,
            className: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }
        ],
        translations[language].common.exactAlarmPermissionNeededTitle
      );
  }, [language, translations, showMessageBox, closeMessageBox, openSettingsWithFallback]);

  useEffect(() => {
    const checkPermissionsOnLoad = async () => {
      try {
        if (window.AndroidBridge && !permissionRequestDismissed && !loading) {
          const canSchedule = await window.AndroidBridge.canScheduleExactAlarms();
          if (!canSchedule) {
            showMessageBox(
              translations[language].common.exactAlarmPermissionNeededBody,
              [
                {
                  text: translations[language].common.openSettings,
                  onClick: openSettingsWithFallback,
                  className: 'bg-[#20747f] hover:bg-[#1a5b64] text-white'
                },
                {
                  text: translations[language].common.dontAskAgain,
                  onClick: () => {
                    localStorage.setItem('ctfNotificationPermissionDismissed', 'true');
                    setPermissionRequestDismissed(true);
                    closeMessageBox();
                  },
                  className: 'bg-gray-500 hover:bg-gray-600 text-white'
                },
                {
                  text: translations[language].common.later,
                  onClick: closeMessageBox,
                  className: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }
              ],
              translations[language].common.exactAlarmPermissionNeededTitle
            );
          }
        }
      } catch (e) {
        console.error("Error checking Android permissions:", e);
      }
    };
    const timer = setTimeout(checkPermissionsOnLoad, 1000);
    return () => clearTimeout(timer);
  }, [loading, permissionRequestDismissed, language, translations, showMessageBox, closeMessageBox, openSettingsWithFallback]);

  const scheduleActualNotification = useCallback(async (item) => {
    try {
        const notificationTime = parseDateForSorting(item.date);
        if (isNaN(notificationTime.getTime()) || !item.time) return;

        const [h, m] = item.time.split(':');
        notificationTime.setHours(h, m, 0, 0);

        const reminderTime = new Date(notificationTime.getTime() - 20 * 60 * 1000);
        const now = new Date();
        const fullTitle = item.artist ? `${item.artist} - ${item.title}` : item.title;

        if (reminderTime <= now) {
            if (item.crowdLevel?.toLowerCase() === 'geannuleerd' || item.crowdLevel?.toLowerCase() === 'cancelled') {
                const title = translations[language].common.cancellationNotificationTitle;
                const body = translations[language].common.cancellationNotificationBody.replace('%s', fullTitle);
                if (window.AndroidBridge?.scheduleNativeNotification) {
                    const appUrl = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(item.event)}`;
                    window.AndroidBridge.scheduleNativeNotification(title, body, Date.now(), `cancellation-${item.id}`, appUrl);
                } else if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(title, { body });
                }
            }
            return;
        }

        const title = translations[language].common.notificationTitle;
        const body = translations[language].common.notificationBody.replace('%s', fullTitle).replace('%s', item.location);
        const notificationId = item.id;

        if (window.AndroidBridge?.scheduleNativeNotification) {
            const canSchedule = await window.AndroidBridge.canScheduleExactAlarms();
            if (!canSchedule) {
                if (!permissionRequestDismissed) showPermissionDialog();
                return;
            }
            window.AndroidBridge.scheduleNativeNotification(title, body, reminderTime.getTime(), notificationId, item.url || '');
        } else if ('Notification' in window && Notification.permission === 'granted') {
            const delay = reminderTime.getTime() - now.getTime();
            if (delay > 0) {
                if(notificationTimeouts.current[notificationId]) clearTimeout(notificationTimeouts.current[notificationId]);
                const timeoutId = setTimeout(() => {
                    new Notification(title, { body });
                    delete notificationTimeouts.current[notificationId];
                }, delay);
                notificationTimeouts.current[notificationId] = timeoutId;
            }
        }
    } catch (e) {
        console.error("Failed to schedule notification:", e);
    }
  }, [language, translations, showPermissionDialog, permissionRequestDismissed]);

  const cancelScheduledNotification = useCallback((performanceId) => {
    try {
        if (window.AndroidBridge?.cancelNativeNotification) {
            window.AndroidBridge.cancelNativeNotification(performanceId);
        }
        if (notificationTimeouts.current[performanceId]) {
            clearTimeout(notificationTimeouts.current[performanceId]);
            delete notificationTimeouts.current[performanceId];
        }
    } catch (e) {
        console.error("Failed to cancel notification:", e);
    }
  }, []);

  const scheduleStatusNotification = useCallback((item, type) => {
    try {
        let title, body;
        const fullTitle = item.artist ? `${item.artist} - ${item.title}` : item.title;

        if (type === 'cancelled') {
            title = translations[language].common.cancellationNotificationTitle;
            body = translations[language].common.cancellationNotificationBody.replace('%s', fullTitle);
        } else if (type === 'full') {
            title = translations[language].common.fullNotificationTitle;
            body = translations[language].common.fullNotificationBody.replace('%s', fullTitle);
        } else {
            return;
        }

        const notificationId = `${type}-${item.id}-${new Date().getTime()}`;
        const scheduleTime = Date.now() + 60 * 1000;

        if (window.AndroidBridge?.scheduleNativeNotification) {
            const appUrl = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(item.event)}`;
            window.AndroidBridge.scheduleNativeNotification(title, body, scheduleTime, notificationId, appUrl);
        } else if ('Notification' in window && Notification.permission === 'granted') {
            setTimeout(() => {
                new Notification(title, { body, tag: notificationId });
            }, 60 * 1000);
        }
    } catch (e) {
        console.error("Failed to schedule status notification:", e);
    }
  }, [language, translations]);

  useEffect(() => {
    if (loading || prevTimetableDataRef.current.length === 0 || favorites.size === 0) {
        return;
    }

    const prevDataMap = new Map(prevTimetableDataRef.current.map(item => [item.id, item]));
    const favoritesToRemove = new Set();

    favorites.forEach(favId => {
        const currentItem = timetableData.find(item => item.id === favId);
        const prevItem = prevDataMap.get(favId);

        if (currentItem && prevItem) {
            const currentStatus = currentItem.crowdLevel?.toLowerCase();
            const prevStatus = prevItem.crowdLevel?.toLowerCase();

            if (currentStatus !== prevStatus) {
                if (currentStatus === 'geannuleerd' || currentStatus === 'cancelled') {
                    scheduleStatusNotification(currentItem, 'cancelled');
                    cancelScheduledNotification(currentItem.id);
                    favoritesToRemove.add(favId);
                }
                if (currentStatus === 'vol' || currentStatus === 'full') {
                    scheduleStatusNotification(currentItem, 'full');
                    favoritesToRemove.add(favId);
                }
            }
        }
    });

    if (favoritesToRemove.size > 0) {
        setFavorites(prevFavorites => {
            const newFavorites = new Set(prevFavorites);
            favoritesToRemove.forEach(id => newFavorites.delete(id));
            localStorage.setItem('ctfTimetableFavorites', JSON.stringify([...newFavorites]));
            return newFavorites;
        });
    }
  }, [timetableData, favorites, loading, scheduleStatusNotification, cancelScheduledNotification]);

  useEffect(() => {
      prevTimetableDataRef.current = timetableData;
  }, [timetableData]);

  const processAndScheduleGeneralNotifications = useCallback(async (notifications) => {
    try {
        if (!Array.isArray(notifications)) {
            console.error("General notifications data is not an array:", notifications);
            return;
        }

        let hasPermission = true;
        if (window.AndroidBridge) {
            hasPermission = await window.AndroidBridge.canScheduleExactAlarms();
            if (!hasPermission && !permissionRequestDismissed) {
                showPermissionDialog();
                return;
            }
        } else if (!('Notification' in window) || Notification.permission !== 'granted') {
            hasPermission = false;
        }

        const newlyScheduledIds = new Set();
        const now = new Date();

        for (const notif of notifications) {
            if (!notif.id || !notif.date) continue;
            if (scheduledCustomNotifications.has(notif.id)) continue;
            const notificationDateTime = new Date(notif.date);
            if (isNaN(notificationDateTime.getTime()) || notificationDateTime <= now) continue;
            if (!hasPermission) continue;

            const title = translations[language].common.genericNotificationTitle;
            const body = language === 'nl' ? notif.text_nl : notif.text_en;
            if (!body) continue;
            
            if (window.AndroidBridge?.scheduleNativeNotification) {
                window.AndroidBridge.scheduleNativeNotification(title, body, notificationDateTime.getTime(), notif.id, notif.url || '');
            } else {
                const delay = notificationDateTime.getTime() - now.getTime();
                setTimeout(() => { new Notification(title, { body }); }, delay);
            }
            newlyScheduledIds.add(notif.id);
        }

        if (newlyScheduledIds.size > 0) {
            setScheduledCustomNotifications(prev => {
                const newSet = new Set([...prev, ...newlyScheduledIds]);
                localStorage.setItem('ctfScheduledCustomNotifications', JSON.stringify([...newSet]));
                return newSet;
            });
        }
    } catch (e) {
        console.error("Failed to process general notifications:", e);
    }
  }, [language, translations, scheduledCustomNotifications, permissionRequestDismissed, showPermissionDialog]);

  useEffect(() => {
    const fetchAndProcessGistNotifications = async () => {
      if (!gistNotificationsUrl) return;
      try {
        const response = await fetch(gistNotificationsUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        processAndScheduleGeneralNotifications(json);
      } catch (err) {
        console.error("Error fetching or processing Gist notifications:", err);
      }
    };
    if (!loading) fetchAndProcessGistNotifications();
  }, [loading, processAndScheduleGeneralNotifications]);

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
    } else if (currentView === 'friends-favorites') {
        sourceData = timetableData.filter(item => friendsFavorites.has(item.id));
    } else if (searchTerm) {
        sourceData = timetableData.filter(item => 
            (item.artist && item.artist.toLowerCase().includes(lowerCaseSearchTerm)) ||
            item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
            item.location.toLowerCase().includes(lowerCaseSearchTerm)
        );
    } else if (selectedEvent) {
        if (selectedDate === 'calm-route') {
            sourceData = timetableData.filter(item => item.event === selectedEvent && item.isCalmRoute);
        } else if (selectedDate === 'all-performances') {
            const uniqueTitles = new Map();
            timetableData.filter(item => item.event === selectedEvent).forEach(item => {
                const fullTitle = item.artist ? `${item.artist} - ${item.title}` : item.title;
                if (!uniqueTitles.has(fullTitle)) uniqueTitles.set(fullTitle, item);
            });
            sourceData = [...uniqueTitles.values()];
        } else {
            sourceData = timetableData.filter(item => item.event === selectedEvent && item.date === selectedDate);
        }
    } else {
        return [];
    }
    
    if (sourceData.length === 0) return [];

    if (currentView === 'favorites' || currentView === 'friends-favorites' || searchTerm) {
        const groupedByEvent = sourceData.reduce((acc, item) => {
            (acc[item.event] = acc[item.event] || []).push(item);
            return acc;
        }, {});
        return Object.keys(groupedByEvent).sort((a, b) => {
            const dateA = parseDateForSorting(eventInfoMap[a]?.dateString);
            const dateB = parseDateForSorting(eventInfoMap[b]?.dateString);
            if (!dateA || isNaN(dateA.getTime())) return 1;
            if (!dateB || isNaN(dateB.getTime())) return -1;
            return dateA - dateB;
        }).map(eventName => {
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
  }, [searchTerm, currentView, selectedEvent, selectedDate, timetableData, favorites, friendsFavorites, language, translations, eventInfoMap]);

  const datesForCurrentSelectedEvent = useMemo(() => {
    if (currentView === 'favorites' || currentView === 'friends-favorites' || !selectedEvent) return [];
    return [...new Set(timetableData.filter(item => item.event === selectedEvent && item.date).map(item => item.date))]
           .sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
  }, [timetableData, selectedEvent, currentView]);

  const toggleFavorite = useCallback((itemObject, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemObject.id)) {
        newFavorites.delete(itemObject.id);
        cancelScheduledNotification(itemObject.id);
      } else {
        newFavorites.add(itemObject.id);
        scheduleActualNotification(itemObject);
      }
      localStorage.setItem('ctfTimetableFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, [scheduleActualNotification, cancelScheduledNotification]);

  useEffect(() => {
    if (timetableData.length > 0 && favorites.size > 0) {
        const dataMap = new Map(timetableData.map(item => [item.id, item]));
        favorites.forEach(favId => {
            const item = dataMap.get(favId);
            if (item) {
                scheduleActualNotification(item);
            }
        });
    }
  }, [timetableData, favorites, scheduleActualNotification]);

  const addToGoogleCalendar = useCallback((e, title, date, time, location) => {
    e.stopPropagation();
    const dateObj = parseDateForSorting(date);
    if (isNaN(dateObj.getTime()) || !time) {
      console.error("Invalid date or time for calendar event:", date, time);
      return;
    }
    
    // Gebruik getFullYear, getMonth, etc. omdat de datum nu lokaal is
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    
    const [startHour, startMinute] = time.split(':').map(Number);
    
    // Creëer de start- en einddatum in de lokale tijdzone
    const startDate = new Date(year, month, day, startHour, startMinute);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    // Formatteer voor Google Calendar. Google is slim genoeg om dit correct te interpreteren.
    const formatForGoogle = (d) => {
        const yyyy = d.getFullYear(); // FIX: 'പ്രദേശ' is veranderd naar 'yyyy'
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const DD = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${yyyy}${MM}${DD}T${hh}${mm}${ss}`; // Dit werkt nu correct
    };

    const startDateString = formatForGoogle(startDate);
    const endDateString = formatForGoogle(endDate);
    
    // De 'ctz' parameter vertelt Google in welke tijdzone de data is.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateString}/${endDateString}&ctz=${timezone}&details=${encodeURIComponent('Locatie: ' + location)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(url, '_blank');
  }, []);

  const handleIconMouseEnter = useCallback((e, content) => {
    setCustomTooltipContent(content);
    setCustomTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
    setShowCustomTooltip(true);
  }, []);

  const handleIconMouseLeave = useCallback(() => setShowCustomTooltip(false), []);
  
  const renderMainContent = () => {
      if (loading && isInitialLoad) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
      }
      
      const isFavorites = currentView === 'favorites';
      const isFriendsFavorites = currentView === 'friends-favorites';

      let currentViewMode = 'card';
      let setViewModeFunction = () => {};
      if (isFavorites) {
        currentViewMode = favoritesViewMode;
        setViewModeFunction = setFavoritesViewMode;
      } else if (isFriendsFavorites) {
        currentViewMode = friendsFavoritesViewMode;
        setViewModeFunction = setFriendsFavoritesViewMode;
      } else if (currentView === 'timetable') {
        currentViewMode = eventViewMode;
        setViewModeFunction = setEventViewMode;
      }
      
      return (
        <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
            {(selectedEvent || isFavorites || isFriendsFavorites) && (
                <>
                  {/* WIJZIGING: Conditionele weergave van sponsor of verwijderknop */}
                  {currentView === 'friends-favorites' && friendsFavorites.size > 0 ? (
                      <div className="flex flex-col items-center justify-center mt-12 mb-8 text-center">
                          <button 
                              onClick={handleClearFriendsFavorites} 
                              className="px-6 py-3 bg-[#1a5b64] text-white rounded-lg shadow-md hover:bg-[#2e9aaa] transition-all duration-200 text-base font-semibold"
                          >
                              {translations[language].common.removeFriendsFavorites}
                          </button>
                      </div>
                  ) : (
                      <SponsorDisplay ref={sponsorRef} sponsorInfo={currentSponsorInfo} language={language} translations={translations} />
                  )}
                  
                  {currentView === 'timetable' && !searchTerm && eventViewMode === 'card' && (
                      <DateNavigation datesForCurrentSelectedEvent={datesForCurrentSelectedEvent} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setSearchTerm={setSearchTerm} translations={translations} language={language} selectedEvent={selectedEvent} timetableData={timetableData} />
                  )}

                  {currentView === 'timetable' && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} translations={translations} language={language} />}
                  
                  {(isFavorites || isFriendsFavorites || (currentView === 'timetable' && selectedEvent)) && (
                      <div className="flex flex-wrap justify-center items-center gap-4 my-8">
                          <EventViewSwitcher 
                              viewMode={currentViewMode} 
                              setViewMode={setViewModeFunction}
                              language={language} 
                              translations={translations} 
                              handleAnimatedUpdate={handleAnimatedUpdate}
                          />
                          {isFavorites && favorites.size > 0 && (
                            <button onClick={() => setShowExportModal(true)} className="px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                                 {translations[language].common.exportFavorites}
                            </button>
                          )}
                      </div>
                  )}
                  
                  {currentViewMode === 'card' ? (
                     <TimetableDisplay loading={loading && !isInitialLoad} error={error} displayedData={formattedData} currentView={currentView} favorites={favorites} toggleFavorite={toggleFavorite} addToGoogleCalendar={addToGoogleCalendar} openContentPopup={openContentPopup} language={language} handleIconMouseEnter={handleIconMouseEnter} handleIconMouseLeave={handleIconMouseLeave} translations={translations} selectedEvent={selectedEvent} searchTerm={searchTerm} showMessageBox={showMessageBox} selectedDate={selectedDate} />
                  ) : (
                     <BlockTimetable allData={timetableData} favorites={favorites} friendsFavorites={friendsFavorites} toggleFavorite={toggleFavorite} selectedEvent={selectedEvent} openContentPopup={openContentPopup} translations={translations} language={language} isFavoritesView={isFavorites} isFriendsView={isFriendsFavorites} />
                  )}
                  
                  {currentView !== 'block' && selectedEvent && eventInfoMap[selectedEvent]?.mapUrl && !loading && !error && (
                      <div className="mt-8 mb-8 w-full max-w-sm px-4 cursor-pointer mx-auto" onClick={() => openContentPopup('image', eventInfoMap[selectedEvent].mapUrl)}>
                          <h2 className="text-center text-white text-2xl font-bold mb-4">{translations[language].common.mapTitle.replace('%s', selectedEvent)}</h2>
                          <img src={eventInfoMap[selectedEvent].mapUrl} alt={`[Afbeelding van Kaart ${selectedEvent}]`} className="w-full h-auto rounded-lg shadow-lg border-4 border-white/50 hover:border-white transition-all"/>
                      </div>
                  )}
                  {/* ========= WIJZIGING: "Word Stamgast" en "Pay What You Can" verplaatst en responsive gemaakt ========= */}
                  {!loading && !error && !searchTerm && (
                    <div className="mt-8 mb-32 w-full max-w-lg mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-8">
                        {/* Pay What You Can Image/Button */}
                        <div className="w-full sm:w-1/2 cursor-pointer" onClick={() => openContentPopup('text', translations[language].payWhatYouCan)}>
                            <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Afbeelding_van_WhatsApp_op_2025-06-24_om_11.16.13_85e74e32-removebg-preview.png" alt="[Afbeelding van Pay What You Can tekst]" className="w-full h-auto"/>
                        </div>
                        {/* Become a Regular Guest Button */}
                        <div className="w-full sm:w-1/2 flex items-center justify-center">
                            <button onClick={() => openContentPopup('iframe', 'https://form.jotform.com/223333761374051')} className="px-6 py-3 bg-white text-[#20747f] rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-base font-semibold">
                                {translations[language].common.becomeRegularGuest}
                            </button>
                        </div>
                    </div>
                  )}
                </>
            )}
          </div>
        </div>
      )
  }

  return (
    <div className={`min-h-screen bg-[#20747f] font-sans text-gray-100 flex flex-col items-center relative overflow-x-hidden ${isInitialLoad ? 'h-screen overflow-hidden' : ''}`}>
      
      <StickyHeader 
          isVisible={showStickyHeader} 
          uniqueEvents={uniqueEvents} 
          handleEventClick={(e) => handleViewChange('timetable', e)} 
          handleFavoritesClick={() => handleViewChange('favorites')} 
          handleFriendsFavoritesClick={() => handleViewChange('friends-favorites')}
          hasFriendsFavorites={friendsFavorites.size > 0}
          onLogoClick={handleStickyLogoClick} 
          selectedEvent={selectedEvent} 
          currentView={currentView} 
          language={language} 
          handleLanguageChange={handleLanguageChange} 
          translations={translations} 
      />
      
      <OfflineIndicator isOffline={isOffline} language={language} translations={translations} />

      <div className="w-full flex-grow relative">

        {/* Initial View */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isInitialLoad ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
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
                  <EventNavigation 
                      onEventSelect={(e) => handleViewChange('timetable', e)} 
                      onFavoritesSelect={() => handleViewChange('favorites')} 
                      onFriendsFavoritesSelect={() => handleViewChange('friends-favorites')}
                      hasFriendsFavorites={friendsFavorites.size > 0}
                      uniqueEvents={uniqueEvents} 
                      language={language} 
                      translations={translations} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content View */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isInitialLoad ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
           <div id="main-content-area" className={`w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 ${showStickyHeader ? (isOffline ? 'pt-32 sm:pt-28' : 'pt-24 sm:pt-20') : ''}`}>
            {renderMainContent()}
          </div>
        </div>
      </div>

      <PopupModal showPopup={showPopup} closePopup={closePopup} popupContent={popupContent} language={language} translations={translations} />
      <PrivacyPolicyModal showPrivacyPolicy={showPrivacyPolicy} setShowPrivacyPolicy={setShowPrivacyPolicy} language={language} renderPrivacyPolicyContent={renderPrivacyPolicyContent} translations={translations} />
      <CustomTooltip showCustomTooltip={showCustomTooltip} customTooltipContent={customTooltipContent} customTooltipPosition={customTooltipPosition} />
      <MessageBox show={messageBoxConfig.show} title={messageBoxConfig.title} message={messageBoxConfig.message} buttons={messageBoxConfig.buttons} />
      <ExportModal 
        show={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        onExport={handleExport}
        language={language} 
        translations={translations[language]} 
        isExporting={isExporting}
      />
      <ImportFavoritesModal 
        show={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImport={handleImportFavorites}
        performances={sharedFavoritesForImport}
        language={language}
        translations={translations[language]}
      />
      {exportConfig && (
          <div style={{ position: 'absolute', left: '-9999px', top: 0, backgroundColor: '#20747f', padding: '20px' }}>
              {exportConfig.type === 'card' ? (
                  <TimetableDisplay
                      ref={exportCardViewRef}
                      isExportMode={true}
                      displayedData={formattedData}
                      currentView="favorites"
                      favorites={favorites}
                      language={language}
                      translations={translations}
                      toggleFavorite={() => {}}
                      addToGoogleCalendar={() => {}}
                      openContentPopup={() => {}}
                      handleIconMouseEnter={() => {}}
                      handleIconMouseLeave={() => {}}
                      showMessageBox={() => {}}
                  />
              ) : (
                  <BlockTimetable
                      ref={exportBlockViewRef}
                      isExportMode={true}
                      allData={timetableData}
                      favorites={favorites}
                      isFavoritesView={true}
                      language={language}
                      translations={translations}
                      toggleFavorite={() => {}}
                      openContentPopup={() => {}}
                  />
              )}
          </div>
      )}
    </div>
  );
};

// De uiteindelijke App component die de ErrorBoundary om de content wikkelt
const App = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);


export default App;
