import React, { useState, useEffect, useRef, useMemo } from 'react';

// Functie om datumstring te parsen naar een Date-object voor vergelijking en weergave
const parseDateForSorting = (dateString) => {
  let [day, month, year] = dateString.split('-');
  if (day && month && year && !isNaN(parseInt(month, 10))) {
    return new Date(year, parseInt(month, 10) - 1, day);
  }

  const monthNames = {
    'januari': 1, 'februari': 2, 'maart': 3, 'april': 4, 'mei': 5, 'juni': 6,
    'juli': 7, 'augustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'december': 12
  };
  const monthNamesAbbr = {
    'jan': 1, 'feb': 2, 'mrt': 3, 'apr': 4, 'mei': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'okt': 10, 'nov': 11, 'dec': 12
  };

  const parts = dateString.split(' ');
  if (parts.length === 3) {
    day = parseInt(parts[0], 10);
    let monthNum = monthNames[parts[1]?.toLowerCase()] || monthNamesAbbr[parts[1]?.toLowerCase()];
    year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthNum && !isNaN(year)) {
      return new Date(year, monthNum - 1, day);
    }
  }

  return new Date(NaN);
};

// Vertalingen voor de app
const translations = {
  nl: {
    common: {
      timetable: 'Timetable',
      favorites: 'Favorieten',
      searchPlaceholder: 'Zoek op voorstelling of locatie',
      moreDates: 'Meer dagen',
      lessDates: 'Minder dagen',
      loading: 'Timetable wordt ingeladen...',
      errorOops: 'Oeps, er ging iets mis!',
      errorLoading: 'Fout bij het laden van de dienstregeling. Probeer het later opnieuw of controleer de URL/sheet-structuur.',
      tryAgain: 'Opnieuw proberen',
      noFavoritesFound: 'Geen favoriete voorstellingen gevonden.',
      noSearchResults: 'Geen voorstellingen of locaties gevonden voor \'%s\' %s.',
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
      notificationTitle: 'Herinnering: Voorstelling begint bijna!',
      notificationBody: '%s in %s begint over 30 minuten.',
      donateButton: 'Klik hier!',
      crowdLevel: 'Verwachte drukte:',
      crowdLevelGreen: 'Rustig',
      crowdLevelOrange: 'Druk',
      crowdLevelRed: 'Erg druk',
      crowdLevelFull: 'Vol', // Nieuwe vertaling
      tooltipCrowdLevelGreenFull: 'De verwachtte drukte voorstelling is rustig. Als je op tijd komt kun je waarschijnlijk een zitplekje vinden!',
      tooltipCrowdLevelOrangeFull: 'De verwachtte drukte voorstelling is druk. We verwachten dat een deel van het publiek moet staan bij deze voorstelling om het goed te kunnen zien.',
      tooltipCrowdLevelRedFull: 'De verwachtte drukte voorstelling is erg druk. Kom op tijd, want het zou zo maar kunnen dat deze voorstelling vol raakt.',
      tooltipCrowdLevelFull: 'Deze voorstelling zit vol! Je kunt wel nog naar een van de andere voorstellingen gaan.', // Nieuwe tooltip
      shareSuccess: 'Link gekopieerd naar klembord!',
      shareError: 'Delen mislukt.'
    },
    payWhatYouCan: {
      title: "Pay What You Can",
      text: `Bij het CTF hoef je nooit een kaartje te kopen of een plekje te reserveren! We vinden dat belangrijk omdat we in cafés spelen, en juist ook de mensen die niet voor de voorstelling komen willen uitnodigen te blijven zitten en de voorstelling mee te maken. Toch vragen we het publiek om ook financieel bij te dragen aan het festival en de makers. Dat doen we met ons **Pay What You Can** systeem.

Na de voorstelling komen de makers langs om te vragen om een financiële bijdrage van **€6,-, €8,-, of €10,- euro.** We hanteren verschillende bedragen omdat we er willen zijn voor bezoekers met een kleine én een grote portemonnee. Je kunt bij het CTF altijd met PIN, of via een QR-code met Tikkie betalen.

Voorstelling gezien maar vergeten te betalen?

Geen probleem! Als je wil kun je nu nog een donatie doen, dit geld wordt gebruikt om de artiesten die op het CTF optreden te betalen.`
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

      Deze app bevat links naar externe websites, zoals de officiële website van het Café Theater Festival en Google Calendar. Wanneer u op deze links klikt, verlaat u onze app en bent u onderworpen aan het privacybeleid van die externe websites. Wij zijn niet verantwoordelijk voor de privacypraktijken van other sites.

      5. Beveiliging
      Aangezien alle relevante gegevens lokaal op uw apparaat worden opgeslagen en er geen gevoelige persoonlijke informatie wordt verzameld of verwerkt, zijn de beveiligingsrisico's minimaal. Wij nemen redelijke maatregelen om de veiligheid van de app te waarborgen.

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
      favorites: 'Favorites',
      searchPlaceholder: 'Search by show or location',
      moreDates: 'More days',
      lessDates: 'Less days',
      loading: 'Timetable is loading...',
      errorOops: 'Oops, something went wrong!',
      errorLoading: 'Error loading the timetable. Please try again later or check the URL/sheet structure.',
      tryAgain: 'Try again',
      noFavoritesFound: 'No favorite shows found.',
      noSearchResults: 'No shows or locations found for \'%s\' %s.',
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
      notificationTitle: 'Reminder: Performance starts soon!',
      notificationBody: '%s at %s starts in 30 minutes.',
      donateButton: 'Click here!',
      crowdLevel: 'Expected crowd:',
      crowdLevelGreen: 'Quiet',
      crowdLevelOrange: 'Busy',
      crowdLevelRed: 'Very busy',
      crowdLevelFull: 'Full', // New translation
      tooltipCrowdLevelGreenFull: 'The expected crowd for this performance is quiet. If you arrive on time, you will probably find a seat!',
      tooltipCrowdLevelOrangeFull: 'The expected crowd for this performance is busy. We expect some of the audience to stand to see it well.',
      tooltipCrowdLevelRedFull: 'The expected crowd for this performance is very busy. Arrive on time, as this performance might fill up.',
      tooltipCrowdLevelFull: 'This performance is full! You can still go to one of the other performances.', // New tooltip
      shareSuccess: 'Link copied to clipboard!',
      shareError: 'Share failed.'
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

      - Notification Permission: The app may ask for your permission to display browser notifications for performance reminders. Your choice (allow or deny) is managed locally by your browser and is not collected or stored by us. We do not send push notifications via a external server; all reminders are managed by your device itself.

      - Search Queries: Search terms you enter in the search bar are not stored or sent to external servers. They are only used to filter the timetable locally.

      3. Sharing Your Information

      We do not share your information with anyone. Since we do not collect or store any personal information, there is no information to share with third parties.

      4. External Links

      This app contains links to external websites, such as the official Café Theater Festival website and Google Calendar. When you click on these links, you leave our app and are subject to the privacy policies of those external websites. Wij are not responsible for the privacypraktijken van other sites.

      5. Security
      Aangezien alle relevante data lokaal op uw apparaat worden opgeslagen en er geen gevoelige persoonlijke informatie wordt verzameld of verwerkt, zijn de beveiligingsrisico's minimaal. Wij take reasonable measures to ensure the security of the app.

      6. Wijzigingen in Dit Privacybeleid
      We may update our privacy policy from time to time. Changes are effective immediately after they are posted in the app. Wij encourage you to review this privacy policy periodically for any changes.

      7. Contact Us
      If you have any questions about this privacy policy, you can contact us at:

      Info@cafetheaterfestival.nl
    `,
  },
};


// Function to render privacy policy content with proper HTML structure
const renderPrivacyPolicyContent = (content) => {
  const lines = content.trim().split('\n');
  const elements = [];
  let currentList = [];

  const addCurrentList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 mb-4 text-gray-700">
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
      elements.push(<h3 key={`h3-${index}`} className="text-xl font-bold mb-2 text-[#20747f]">{trimmedLine}</h3>);
    } else if (trimmedLine.startsWith('- ')) { // List items
      const listItemContent = trimmedLine.substring(2).trim();
      currentList.push(
        <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: listItemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      );
    } else if (trimmedLine === '') { // Empty line
      addCurrentList(); // Close any open list
      // Do nothing for empty lines, they act as separators for paragraphs implicitly
    } else { // Paragraph
      addCurrentList(); // Close any open list
      elements.push(
        <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="mb-4 last:mb-0" />
      );
    }
  });

  addCurrentList(); // Add any remaining list items at the end

  return elements;
};

// Component voor de app-header (logo, titel, taalwisselaar, privacybeleid)
const AppHeader = ({ language, handleLanguageChange, setShowPrivacyPolicy, translations }) => (
  <>
    {/* Taalwisselaar */}
    <div className="absolute top-12 right-4 z-50">
      <button
        onClick={handleLanguageChange}
        className="px-3 py-1 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-sm font-semibold"
      >
        {language === 'nl' ? 'EN' : 'NL'}
      </button>
    </div>

    {/* Privacy Policy Button in top-left corner */}
    <div className="absolute top-12 left-4 z-50">
      <button
        onClick={() => setShowPrivacyPolicy(true)}
        className="px-3 py-1 rounded-full bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50 transition-colors duration-200 text-sm font-semibold"
      >
        {translations[language].common.privacyPolicy}
      </button>
    </div>

    {/* [Image of Café Theater Festival Logo in wit] */}
    <img
      src="Logo_Web_Trans_Wit.png"
      alt="[Image of Café Theater Festival Logo in wit]"
      className="w-full max-w-[10rem] h-auto mb-4"
    />

    {/* Titel van de app */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 text-center drop_shadow-lg font-oswald">
      {translations[language].common.timetable}
    </h1>
  </>
);

// Component voor de evenementnavigatiebalk
const EventNavigation = ({
  loading, error, uniqueEvents, currentView, setCurrentView, setSelectedEvent, setSearchTerm,
  timetableData, setSelectedDate, translations, language, selectedEvent
}) => (
  <>
    {!loading && !error && (uniqueEvents.length > 0 || currentView === 'favorites') && (
      <div className="flex flex-wrap justify-center gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
        {/* Dynamische evenementknoppen */}
        {uniqueEvents.map(event => (
          <button
            key={event}
            onClick={() => {
              setCurrentView('timetable');
              setSelectedEvent(event);
              setSearchTerm('');
              const datesForEvent = timetableData.filter(item => item.event === event && item.date && item.date !== 'N/A').map(item => item.date);
              const firstDateForEvent = Array.from(new Set(datesForEvent)).sort((a,b) => parseDateForSorting(a) - parseDateForSorting(b))[0];
              setSelectedDate(firstDateForEvent || null);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentView === 'timetable' && selectedEvent === event
                ? 'bg-[#1a5b64] text-white shadow-md'
                : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
            }`}
          >
            {event}
          </button>
        ))}
        {/* Favorieten knop */}
        <button
          onClick={() => {
            setCurrentView('favorites');
            setSelectedDate('favorites-view');
            setSearchTerm('');
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            currentView === 'favorites'
              ? 'bg-[#1a5b64] text-white shadow-md'
              : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
          }`}
        >
          {translations[language].common.favorites}
        </button>
      </div>
    )}
  </>
);

// Component voor de datumnavigatiebalk
const DateNavigation = ({
  loading, error, datesForCurrentSelectedEvent, visibleDatesForEvent, hiddenDatesForEvent,
  showMoreDates, setShowMoreDates, selectedDate, setSelectedDate, setSearchTerm, translations, language, currentView
}) => (
  <>
    {currentView === 'timetable' && !loading && !error && datesForCurrentSelectedEvent.length > 0 && (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-3 bg-white bg-opacity-20 rounded-xl shadow-lg max-w-full overflow-x-auto scrollbar-hide">
        {/* Toon de eerste vijf datums */}
        {visibleDatesForEvent.map(date => (
          <button
            key={date}
            onClick={() => { setSelectedDate(date); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedDate === date && currentView === 'timetable'
                ? 'bg-[#1a5b64] text-white shadow-md'
                : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
            }`}
          >
            {date}
          </button>
        ))}
        {/* "Meer dagen" knop en verborgen datums */}
        {hiddenDatesForEvent.length > 0 && (
          <>
            <button
              onClick={() => setShowMoreDates(!showMoreDates)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                showMoreDates
                  ? 'bg-[#1a5b64] text-white shadow-md'
                  : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
              }`}
            >
              {showMoreDates ? translations[language].common.lessDates : translations[language].common.moreDates}
            </button>
            {showMoreDates && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full mt-2">
                {hiddenDatesForEvent.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSearchTerm(''); }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      selectedDate === date && currentView === 'timetable'
                        ? 'bg-[#1a5b64] text-white shadow-md'
                        : 'bg-white bg-opacity-30 text-gray-100 hover:bg-opacity-50'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    )}
  </>
);


// Component voor de zoekbalk
const SearchBar = ({ searchTerm, setSearchTerm, currentView, selectedEvent, translations, language }) => (
  <div className="w-full max-w-md mb-8 px-4">
    <input
      type="text"
      placeholder={
        translations[language].common.searchPlaceholder +
        (currentView === 'timetable' && selectedEvent
          ? ` ${translations[language].common.forEvent.replace('%s', selectedEvent)} ${translations[language].common.onThisDay}`
          : currentView === 'favorites'
          ? ` ${translations[language].common.inYourFavorites}`
          : '')
      }
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1a5b64] focus:ring focus:ring-[#1a5b64] focus:ring-opacity-50 text-gray-800 shadow-md"
    />
  </div>
);

// Component voor een enkele voorstellingskaart
const PerformanceCard = ({
  item, favorites, toggleFavorite, notificationSubscriptions, toggleNotificationSubscription,
  addToGoogleCalendar, openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations, showMessageBox
}) => {
    // Determine crowd level position and text
    const getCrowdLevelInfo = (level) => {
        let position = '10%'; // Adjusted position for Green
        let colorClass = 'bg-green-600'; // Deeper green
        let tooltipText = translations[language].common.tooltipCrowdLevelGreenFull; // Specific full text
        let isFull = false;

        switch (level?.toLowerCase()) {
            case 'oranje':
            case 'orange':
                position = '50%';
                colorClass = 'bg-yellow-500'; // Brighter yellow/orange
                tooltipText = translations[language].common.tooltipCrowdLevelOrangeFull;
                break;
            case 'rood':
            case 'red':
                position = '90%'; // Adjusted position for Red
                colorClass = 'bg-red-600'; // Deeper red
                tooltipText = translations[language].common.tooltipCrowdLevelRedFull;
                break;
            case 'vol':
            case 'full':
                isFull = true;
                tooltipText = translations[language].common.tooltipCrowdLevelFull;
                break;
            case 'groen':
            case 'green':
            default:
                position = '10%'; // Adjusted position for Green
                colorClass = 'bg-green-600';
                tooltipText = translations[language].common.tooltipCrowdLevelGreenFull;
                break;
        }
        return { position, colorClass, tooltipText, isFull };
    };

    const crowdInfo = item.crowdLevel ? getCrowdLevelInfo(item.crowdLevel) : null;

    const handleShare = async (e, title, url) => {
        e.stopPropagation(); // Prevent the card click from opening the iframe

        const shareData = {
            title: title,
            text: `Bekijk deze voorstelling: ${title} op het Café Theater Festival!`,
            url: url || window.location.href // Fallback to current page if no specific URL
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showMessageBox(translations[language].common.shareSuccess);
            } else {
                // Fallback for browsers that do not support navigator.share
                await navigator.clipboard.writeText(shareData.url);
                showMessageBox(translations[language].common.shareSuccess);
            }
        } catch (error) {
            console.error('Error sharing:', error);
            showMessageBox(translations[language].common.shareError);
        }
    };

    return (
        <div
            className="bg-white text-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 hover:scale-105 hover:hover:shadow-2xl cursor-pointer flex flex-col relative min-h-[180px] w-full md:w-[384px]"
            onClick={() => openContentPopup('iframe', item.url)} // Click on card opens item.url in iframe
        >
            {/* Tijd */}
            <p className="text-xl font-bold text-gray-800 mb-2">{item.time}</p>

            {/* Inhoudsrij: Titel en Locatie met Maps Pin */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2">
                {/* Titel (links) */}
                <h3 className="text-lg font-semibold text-[#20747f] mb-2 sm:mb-0 sm:mr-4">
                    {item.title}
                </h3>

                {/* Locatie en Google Maps Pin */}
                <div className="flex items-center text-gray-600 text-sm">
                    {item.location}
                    {item.googleMapsUrl && item.googleMapsUrl !== '' && (
                        <a
                            href={item.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default link navigation
                                e.stopPropagation(); // Prevent card click
                                window.open(item.googleMapsUrl, '_blank'); // Explicitly open in new window
                            }}
                            className="ml-1 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            title={translations[language].common.openLocationInGoogleMaps}
                        >
                            {/* [Image of a Google Maps pin] */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 inline-block"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </a>
                    )}
                </div>
            </div>

            {/* Crowd Meter / Vol Indicator */}
            {crowdInfo && item.crowdLevel !== 'N/A' && (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {translations[language].common.crowdLevel}
                </p>
                <div
                    className={`relative w-1/2 h-4 rounded-full mb-4 ${
                        crowdInfo.isFull ? 'bg-red-600' : 'bg-gradient-to-r from-green-600 via-yellow-500 to-red-600'
                    }`}
                    onMouseEnter={(e) => handleIconMouseEnter(e, crowdInfo.tooltipText)}
                    onMouseLeave={handleIconMouseLeave}
                >
                    {!crowdInfo.isFull ? (
                        <div
                            className="absolute top-0 w-2 h-full rounded-full bg-gray-800 -translate-y-1/2"
                            style={{ left: crowdInfo.position, top: '50%', zIndex: 10, transform: 'translate(-50%, -50%)' }}
                        ></div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-800"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    )}
                </div>
              </>
            )}


            {/* Iconencontainer voor Favorieten, Notificaties, Agenda en Delen */}
            <div className="absolute top-4 right-4 flex flex-row space-x-2">
                {/* Favorieten Harticoon */}
                <div
                    className="cursor-pointer"
                    onClick={(e) => toggleFavorite(item, e)}
                    title={favorites.has(item.id) ? translations[language].common.removeFromFavorites : translations[language].common.addToFavorites}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-7 w-7 transition-colors duration-200 ${
                            favorites.has(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                        }`}
                        viewBox="0 0 24 24"
                        fill={favorites.has(item.id) ? 'currentColor' : 'none'}
                        stroke={favorites.has(item.id) ? 'currentColor' : 'currentColor'}
                        strokeWidth="1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>

                {/* Notificatie Belicoon */}
                <div
                    className="cursor-pointer"
                    onClick={(e) => toggleNotificationSubscription(item, e)}
                    title={notificationSubscriptions.has(item.id) ? translations[language].common.stopNotifications : translations[language].common.getNotifications}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-7 w-7 transition-colors duration-200 ${
                            notificationSubscriptions.has(item.id) ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'
                        }`}
                        viewBox="0 0 24 24"
                        fill={notificationSubscriptions.has(item.id) ? 'currentColor' : 'none'}
                        stroke={notificationSubscriptions.has(item.id) ? 'currentColor' : 'currentColor'}
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>

                {/* Agenda Kalendericoon */}
                <div
                    className="cursor-pointer"
                    onClick={(e) => addToGoogleCalendar(e, item.title, item.date, item.time, item.location)}
                    title={translations[language].common.addToGoogleCalendar}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>

                {/* Deel-icoon */}
                <div
                    className="cursor-pointer"
                    onClick={(e) => handleShare(e, item.title, item.url)}
                    title={translations[language].common.sharePerformance}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </div>
            </div>

            {/* Safety Info Icons and More Info Button */}
            {/* Outer container: flex-col on small, flex-row on medium screens and up */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-auto pt-4 border-t border-gray-200 w-full">
                {/* Inner container for icons: always flex-row, will wrap if space is too small */}
                <div className="flex flex-row flex-wrap justify-start items-center mb-2 sm:mb-0"> {/* Added mb-2 for spacing below icons on small screens before the button */}
                    {item.safetyInfo.wheelchairAccessible && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipWheelchair)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of a wheelchair] */}
                            <img
                                src="CTF-ICONS_Rolstoeltoegankelijk.png"
                                alt="[Image of a wheelchair]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                    {item.safetyInfo.suitableForChildren && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipChildren)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of symbol for playing children] */}
                            <img
                                src="CTF-ICONS_Geschikt-Voor-Kinderen.png"
                                alt="[Image of symbol for playing children]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                    {item.safetyInfo.dutchLanguage && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipDutch)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of the Dutch flag or text NL] */}
                            <img
                                src="CTF-ICONS_NL.png"
                                alt="[Image of the Dutch flag or text NL]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                    {item.safetyInfo.englishLanguage && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipEnglish)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of the English flag or text ENG] */}
                            <img
                                src="CTF-ICONS_ENG.png"
                                alt="[Image of the English flag or text ENG]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                    {item.safetyInfo.dialogueFree && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipDialogueFree)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of a speech bubble with a cross through it] */}
                            <img
                                src="CTF-ICONS_DIALOGUE-FREE.png"
                                alt="[Image of a speech bubble with a cross through it]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                    {item.safetyInfo.diningFacility && (
                        <span
                            className="text-gray-600 mr-2"
                            onMouseEnter={(e) => handleIconMouseEnter(e, translations[language].common.tooltipDining)}
                            onMouseLeave={handleIconMouseLeave}
                        >
                            {/* [Image of a plate with a lid] */}
                            <img
                                src="CTF-ICONS_Eetmogelijkheid.png"
                                alt="[Image of a plate with a lid]"
                                className="h-6 w-6 inline-block"
                            />
                        </span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); openContentPopup('iframe', item.url); }}
                    className="px-4 py-2 bg-[#20747f] text-white rounded-lg shadow-md hover:bg-[#1a5b64] transition-all duration-200 text-sm w-full sm:w-auto"
                    disabled={!item.url || item.url === 'N/A'}
                >
                    {translations[language].common.moreInfo}
                </button>
            </div>
        </div>
    );
};


// Component voor het weergeven van de dienstregeling of favorieten
const TimetableDisplay = ({
  loading, error, displayedTimetableData, currentView, favorites, toggleFavorite,
  notificationSubscriptions, toggleNotificationSubscription, addToGoogleCalendar,
  openContentPopup, language, handleIconMouseEnter, handleIconMouseLeave, translations,
  selectedEvent, searchTerm, showMessageBox
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
          onClick={() => window.location.reload()} // Simple reload for retry
          className="mt-4 px-6 py-2 bg-red-700 hover:bg-red-800 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          {translations[language].common.tryAgain}
        </button>
      </div>
    );
  }

  if (displayedTimetableData.length === 0) {
    return (
      <div className="bg-white bg-opacity-20 p-6 rounded-xl shadow-lg text-center font-semibold">
        <p>
          {currentView === 'favorites' && searchTerm
            ? translations[language].common.noSearchResults.replace('%s', searchTerm).replace('%s', translations[language].common.inYourFavorites)
            : currentView === 'favorites'
            ? translations[language].common.noFavoritesFound
            : searchTerm
            ? translations[language].common.noSearchResults.replace('%s', searchTerm).replace('%s', (currentView === 'timetable' && selectedEvent ? `${translations[language].common.forEvent.replace('%s', selectedEvent)} ${translations[language].common.onThisDay}` : ''))
            : translations[language].common.noDataFound.replace('%s', (selectedEvent || translations[language].common.noDataForThisSelection))
          }
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Renderlogica voor zowel 'favorites' als 'timetable' view, door consistent de PerformanceCard component te gebruiken */}
      {displayedTimetableData.map((dayOrEventData, index) => (
        <div key={index} className="mb-8">
          {currentView === 'favorites' && dayOrEventData.eventName && (
            <h2 className="text-2xl font-bold text-white mb-6 text-center drop_shadow-lg">
              {dayOrEventData.eventName}
            </h2>
          )}
          {/* Loop over dates (for favorites view) or just the items (for timetable view) */}
          {(currentView === 'favorites' ? dayOrEventData.dates : [{ items: dayOrEventData.items }]).map((dataGroup, groupIndex) => (
            <div key={groupIndex} className="mb-8 last:mb-0">
              {currentView === 'favorites' && dataGroup.date && (
                <h3 className="text-xl font-semibold text-white mb-4 text-center drop_shadow">
                  {dataGroup.date}
                </h3>
              )}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  dataGroup.items.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-6 justify-items-center justify-center`}
              >
                {dataGroup.items.map((item, itemIndex) => (
                  <PerformanceCard
                    key={itemIndex}
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
                    showMessageBox={showMessageBox} // Pass showMessageBox here
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

// Component voor de algemene pop-up
const PopupModal = ({ showPopup, closePopup, popupContent, language, translations }) => {
  if (!showPopup) return null;

  const renderContent = () => {
    if (!popupContent.data) {
      return (
        <div className="flex items-center justify-center h-full text-xl text-white">
          {translations[language].common.noContentAvailable}
        </div>
      );
    }

    if (popupContent.type === 'text') {
      const { title, text } = popupContent.data;
      // Split the text into paragraphs, handling both Dutch and English formatting for headings
      const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');

      return (
        <div className="p-4 overflow-y-auto text-white leading-relaxed flex-grow">
          <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
          {paragraphs.map((paragraph, index) => {
            // Check if the paragraph should be rendered as a heading (e.g., "Voorstelling gezien..." or "Forgot to pay...")
            const isSubHeading =
              (language === 'nl' && paragraph.includes('Voorstelling gezien maar vergeten te betalen?')) ||
              (language === 'en' && paragraph.includes('Forgot to pay after the show?'));

            if (isSubHeading) {
              return (
                <h2 key={`text-para-${index}`} className="text-2xl font-bold mt-6 mb-2 text-white">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </h2>
              );
            } else {
              return (
                <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="mb-4 last:mb-0" />
              );
            }
          })}

          {/* Nieuwe knop toevoegen, alleen als dit de Pay What You Can pop-up is */}
          {title === translations[language].payWhatYouCan.title && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  console.log("Donatieknop geklikt! Voeg hier de donatie-URL toe.");
                  // Optioneel: open een nieuwe tab/venster met de donatie-URL
                  window.open("https://www.google.com", "_blank"); // VERVANG DOOR ECHTE DONATIE-URL
                }}
                className="px-6 py-3 bg-white text-[#20747f] rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-base font-semibold"
              >
                {translations[language].common.donateButton}
              </button>
            </div>
          )}
        </div>
      );
    } else if (popupContent.type === 'iframe') {
      return (
        <iframe
          src={popupContent.data}
          title="Meer informatie"
          className="w-full h-full border-0 rounded-lg"
          onError={(e) => console.error("Fout bij het laden van iframe:", e)}
        ></iframe>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"> {/* Verhoogde z-index */}
      <div className="bg-[#20747f] text-white p-4 rounded-xl shadow-2xl relative w-[80vw] h-[80vh] flex flex-col">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-white hover:text-gray-200 text-3xl font-bold z-10"
          aria-label={translations[language].common.close}
        >
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

// Component voor de privacybeleid pop-up
const PrivacyPolicyModal = ({ showPrivacyPolicy, setShowPrivacyPolicy, language, renderPrivacyPolicyContent, translations }) => {
  if (!showPrivacyPolicy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"> {/* Verhoogde z-index */}
      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowPrivacyPolicy(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10"
          aria-label={translations[language].common.close}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#20747f]">{translations[language].common.privacyPolicy}</h2>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" style={{ color: '#333' }}>
          {renderPrivacyPolicyContent(translations[language].privacyPolicyContent)}
        </div>
      </div>
    </div>
  );
};

// Component voor de custom tooltip
const CustomTooltip = ({ showCustomTooltip, customTooltipContent, customTooltipPosition }) => {
  if (!showCustomTooltip) return null;

  return (
    <div
      className="fixed bg-[#20747f] text-white p-3 rounded-md shadow-lg z-50 text-base pointer-events-none"
      style={{ left: customTooltipPosition.x, top: customTooltipPosition.y }}
    >
      {customTooltipContent}
    </div>
  );
};

// Component voor een custom message box (ter vervanging van alert())
const MessageBox = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
        <div className="text-lg font-medium text-gray-800 mb-4">{message}</div>
        <button
          onClick={onClose}
          className="bg-[#20747f] hover:bg-[#1a5b64] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Component voor de footer buttons
const FooterButtons = ({ openContentPopup, language, translations, showPopup }) => (
  <div className={`fixed bottom-4 inset-x-0 z-50 flex justify-center space-x-4 ${showPopup ? 'hidden' : ''}`}>
    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
      <button
        onClick={() => openContentPopup('iframe', 'https://form.jotform.com/223333761374051')}
        className="px-6 py-3 bg-white text-[#20747f] rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-base font-semibold"
      >
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
  const [uniqueDates, setUniqueDates] = useState([]);
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
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'nl');
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);
  const [customTooltipContent, setCustomTooltipContent] = useState('');
  const [customTooltipPosition, setCustomTooltipPosition] = useState({ x: 0, y: 0 });
  const [messageBoxShow, setMessageBoxShow] = useState(false); // State for custom message box
  const [messageBoxContent, setMessageBoxContent] = useState(''); // Content for message box

  const notificationTimeouts = useRef({}); // Still used for web-based fallbacks

  // Function to show custom message box
  const showMessageBox = (message) => {
    setMessageBoxContent(message);
    setMessageBoxShow(true);
  };

  // Function to close custom message box
  const closeMessageBox = () => {
    setMessageBoxShow(false);
    setMessageBoxContent('');
  };

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('ctfTimetableFavorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
      const storedNotificationSubscriptions = localStorage.getItem('ctfNotificationSubscriptions');
      if (storedNotificationSubscriptions) {
        setNotificationSubscriptions(new Set(JSON.parse(storedNotificationSubscriptions)));
      }
    } catch (e) {
      console.error("Fout bij het laden van favorieten of notificaties uit lokale opslag:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  useEffect(() => {
    // Only request web notification permission if AndroidBridge is NOT available
    // or if the native permission is not granted.
    // In a WebView, AndroidBridge will always be available if correctly setup.
    if (!window.AndroidBridge) { // Fallback for pure web environments or if bridge is not set up
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Notificatietoestemming verleend (Web Fallback).');
                    } else {
                        console.warn('Notificatietoestemming geweigerd (Web Fallback).');
                    }
                });
            } else if (Notification.permission === 'denied') {
                console.warn('Notificatietoestemming eerder geweigerd (Web Fallback). Notificaties zijn uitgeschakeld.');
            }
        } else {
            console.warn('Deze browser ondersteunt geen notificaties (Web Fallback).');
        }
    }


    return () => {
      // Clear any web-based timeouts if they were used
      for (const timeoutId in notificationTimeouts.current) {
        clearTimeout(notificationTimeouts.current[timeoutId]);
      }
    };
  }, []);

  const handleLanguageChange = () => {
    setLanguage(prevLang => prevLang === 'nl' ? 'en' : 'nl');
  };

  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2IpMrUJ8Jyfq1xtIbioh7L0-9SQ4mLo_kOdLnvt2EWXNGews64jMTFHAegaAQ1ZF3pQ4HC_0Kca4D/pub?output=csv';

  const parseCsvLine = (line) => {
    const cells = [];
    let inQuote = false;
    let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        cells.push(currentCell);
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell);
    return cells;
  };

  const fetchTimetableData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(googleSheetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();

      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      const parsedData = [];
      const dates = new Set();
      const eventDatesMap = {};

      for (let i = 1; i < lines.length; i++) {
        const cells = parseCsvLine(lines[i]);

        if (cells.length >= 16) { // Nu minimaal 16 kolommen nodig (index 15 voor Druk)
          const dateFromColumnB = cells[1]?.trim() || '';
          const dateFromColumnH = cells[7]?.trim() || '';
          const dateToUse = dateFromColumnH || dateFromColumnB || 'N/A';

          const event = cells[6]?.trim() || 'N/A';
          const url = cells[5]?.trim() || '';
          const googleMapsUrl = cells[8]?.trim() || '';

          const wheelchairAccessible = (cells[9]?.trim().toLowerCase() === 'x');
          const suitableForChildren = (cells[10]?.trim().toLowerCase() === 'x');
          const dutchLanguage = (cells[11]?.trim().toLowerCase() === 'x');
          const englishLanguage = (cells[12]?.trim().toLowerCase() === 'x');
          const dialogueFree = (cells[13]?.trim().toLowerCase() === 'x');
          const diningFacility = (cells[14]?.trim().toLowerCase() === 'x');
          const crowdLevel = cells[15]?.trim() || 'N/A'; // Kolom P (index 15) is Druk

          const performanceUniqueId = `${event}-${dateToUse}-${cells[2]?.trim() || 'N/A'}-${cells[3]?.trim() || 'N/A'}`;

          parsedData.push({
            id: performanceUniqueId,
            date: dateToUse,
            time: cells[2]?.trim() || 'N/A',
            title: cells[3]?.trim() || 'N/A',
            location: cells[4]?.trim() || 'N/A',
            url: url,
            event: event,
            googleMapsUrl: googleMapsUrl,
            safetyInfo: {
                wheelchairAccessible: wheelchairAccessible,
                suitableForChildren: suitableForChildren,
                dutchLanguage: dutchLanguage,
                englishLanguage: englishLanguage,
                dialogueFree: dialogueFree,
                diningFacility: diningFacility,
            },
            crowdLevel: crowdLevel // Voeg crowdLevel toe
          });

          if (dateToUse && dateToUse !== 'N/A') {
            dates.add(dateToUse);
          }
          if (event && event !== 'N/A') {
            if (!eventDatesMap[event]) {
              eventDatesMap[event] = dateToUse;
            } else {
              if (parseDateForSorting(dateToUse) < parseDateForSorting(eventDatesMap[event])) {
                eventDatesMap[event] = dateToUse;
              }
            }
          }
        }
      }
      setTimetableData(parsedData);

      const allSortedDates = Array.from(dates).sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
      setUniqueDates(allSortedDates);

      const sortedEvents = Object.keys(eventDatesMap).sort((a, b) => {
        return parseDateForSorting(eventDatesMap[a]) - parseDateForSorting(eventDatesMap[b]);
      });
      setUniqueEvents(sortedEvents);

      let newSelectedEvent = selectedEvent;
      if (sortedEvents.length > 0 && (selectedEvent === null || !sortedEvents.includes(selectedEvent))) {
        newSelectedEvent = sortedEvents[0];
      }
      setSelectedEvent(newSelectedEvent);

      let datesForCurrentEvent = [];
      if (currentView === 'timetable' && newSelectedEvent) {
        datesForCurrentEvent = parsedData
          .filter(item => item.event === newSelectedEvent && item.date && item.date !== 'N/A')
          .map(item => item.date);

        const sortedDatesForCurrentEvent = Array.from(new Set(datesForCurrentEvent)).sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));

        if (sortedDatesForCurrentEvent.length > 0) {
            let newSelectedDate = selectedDate;
            if (!newSelectedDate || !sortedDatesForCurrentEvent.includes(newSelectedDate) || newSelectedDate === 'favorites-view') {
                newSelectedDate = sortedDatesForCurrentEvent[0];
            }
            setSelectedDate(newSelectedDate);
        } else {
            setSelectedDate(null);
        }
      } else if (currentView === 'favorites' && selectedDate !== 'favorites-view') {
        setSelectedDate('favorites-view');
      } else if (!newSelectedEvent && sortedEvents.length > 0 && currentView === 'timetable') {
        const firstEventDates = parsedData
          .filter(item => item.event === sortedEvents[0] && item.date && item.date !== 'N/A')
          .map(item => item.date);
        const firstSortedDate = Array.from(new Set(firstEventDates)).sort((a,b) => parseDateForSorting(a) - parseDateForSorting(b))[0];
        setSelectedDate(firstSortedDate || null);
      } else if (sortedEvents.length === 0) {
        setSelectedDate(null);
      }

    } catch (err) {
      console.error("Fout bij het ophalen of parsen van gegevens:", err);
      setError(translations[language].common.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndGroupedTimetableData = () => {
    let dataToDisplay = [];

    if (currentView === 'favorites') {
      let favoriteItems = timetableData.filter(item => favorites.has(item.id));

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        favoriteItems = favoriteItems.filter(item =>
          item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.location.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      const groupedByEvent = favoriteItems.reduce((acc, item) => {
        if (!acc[item.event]) {
          acc[item.event] = [];
        }
        acc[item.event].push(item);
        return acc;
      }, {});

      const sortedEventNames = Object.keys(groupedByEvent).sort((a, b) => {
        const earliestDateA = groupedByEvent[a].reduce((minDate, item) => {
          const itemDate = parseDateForSorting(item.date);
          return (itemDate < minDate || minDate === null) ? itemDate : minDate;
        }, null);
        const earliestDateB = groupedByEvent[b].reduce((minDate, item) => {
          const itemDate = parseDateForSorting(item.date);
          return (itemDate < minDate || minDate === null) ? itemDate : minDate;
        }, null);
        return earliestDateA - earliestDateB;
      });

      dataToDisplay = sortedEventNames.map(eventName => {
        const itemsForEvent = groupedByEvent[eventName];
        const groupedByDateForEvent = itemsForEvent.reduce((acc, item) => {
          if (!acc[item.date]) {
            acc[item.date] = [];
          }
          acc[item.date].push(item);
          return acc;
        }, {});

        const sortedDatesForEvent = Object.keys(groupedByDateForEvent).sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));

        return {
          eventName: eventName,
          dates: sortedDatesForEvent.map(date => ({
            date: date,
            items: groupedByDateForEvent[date]
          }))
        };
      });

    } else {
      if (!selectedDate) return [];

      let baseData = timetableData.filter(item =>
        item.date === selectedDate &&
        (selectedEvent ? item.event === selectedEvent : true)
      );

      let filteredData = baseData;
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredData = baseData.filter(item =>
          item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.location.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      dataToDisplay = [{
        date: selectedDate,
        items: filteredData
      }];
    }
    return dataToDisplay;
  };

  const displayedTimetableData = getFilteredAndGroupedTimetableData();

  const datesForCurrentSelectedEvent = useMemo(() => {
    if (currentView === 'favorites' || !selectedEvent) return [];
    const dates = new Set();
    timetableData.forEach(item => {
      if (item.event === selectedEvent && item.date && item.date !== 'N/A') {
        dates.add(item.date);
      }
    });
    return Array.from(dates).sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
  }, [timetableData, selectedEvent, currentView]);

  const visibleDatesForEvent = datesForCurrentSelectedEvent.slice(0, 5);
  const hiddenDatesForEvent = datesForCurrentSelectedEvent.slice(5);

  const openContentPopup = (type, data) => {
    setPopupContent({ type, data });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent({ type: null, data: null });
  };

  const scheduleActualNotification = (item) => {
    const dateString = String(item.date || '').trim();
    const timeString = String(item.time || '').trim();

    let [day, month, year] = [NaN, NaN, NaN];
    const monthNamesFull = {
        'januari': 1, 'februari': 2, 'maart': 3, 'april': 4, 'mei': 5, 'juni': 6,
        'juli': 7, 'augustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'december': 12
    };
    const monthNamesAbbr = {
        'jan': 1, 'feb': 2, 'mrt': 3, 'apr': 4, 'mei': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'okt': 10, 'nov': 11, 'dec': 12
    };

    const dashParts = dateString.split('-');
    if (dashParts.length === 3) {
      const monthPart = dashParts[1]?.toLowerCase();
      if (!isNaN(parseInt(monthPart, 10))) {
        day = parseInt(dashParts[0], 10);
        month = parseInt(monthPart, 10);
        year = parseInt(dashParts[2], 10);
      } else if (monthNamesAbbr[monthPart]) {
        day = parseInt(dashParts[0], 10);
        month = monthNamesAbbr[monthPart];
        year = parseInt(dashParts[2], 10);
      }
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        const spaceParts = dateString.split(' ');
        if (spaceParts.length === 3) {
            const monthFromText = monthNamesFull[spaceParts[1]?.toLowerCase()] || monthNamesAbbr[spaceParts[1]?.toLowerCase()];
            if (monthFromText) {
                day = parseInt(spaceParts[0], 10);
                month = monthFromText;
                year = parseInt(spaceParts[2], 10);
            }
        }
    }

    const hours = parseInt(timeString.split(':')[0] || '0', 10);
    const minutes = parseInt(timeString.split(':')[1] || '0', 10);

    const eventTime = new Date(year, month - 1, day, hours, minutes);
    const notificationTime = new Date(eventTime.getTime() - 30 * 60 * 1000); // 30 minuten voor aanvang

    const now = new Date();
    const delay = notificationTime.getTime() - now.getTime();

    // Als de native bridge beschikbaar is, gebruik deze dan
    if (window.AndroidBridge && typeof window.AndroidBridge.scheduleNativeNotification === 'function') {
        if (delay > 0) {
            window.AndroidBridge.scheduleNativeNotification(
                translations[language].common.notificationTitle,
                translations[language].common.notificationBody.replace('%s', item.title).replace('%s', item.location),
                notificationTime.getTime(), // Tijd in milliseconden sinds epoch
                item.id // Geef de unieke ID mee om later te kunnen annuleren
            );
            console.log(`Native notificatie gepland voor '${item.title}' over ${Math.round(delay / 1000 / 60)} minuten.`);
        } else {
            console.log(`Native notificatie voor '${item.title}' is niet gepland omdat de tijd in het verleden ligt.`);
            // Als de tijd in het verleden ligt, de-abonneer dan van de notificatie
            setNotificationSubscriptions(prev => {
                const newState = new Set(prev);
                if (newState.has(item.id)) {
                    newState.delete(item.id);
                    localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify(Array.from(newState)));
                }
                return newState;
            });
        }
    } else {
        // Fallback voor webbrowsers of als de bridge niet beschikbaar is
        if ('Notification' in window && Notification.permission === 'granted') {
            if (delay > 0) {
                const uniqueNotificationTag = `notification-${item.id}`;

                if (notificationTimeouts.current[uniqueNotificationTag]) {
                    clearTimeout(notificationTimeouts.current[uniqueNotificationTag]);
                }

                notificationTimeouts.current[uniqueNotificationTag] = setTimeout(() => {
                    new Notification(translations[language].common.notificationTitle, {
                        body: translations[language].common.notificationBody.replace('%s', item.title).replace('%s', item.location),
                        icon: 'Logo_Web_Trans_Wit.png',
                        tag: uniqueNotificationTag,
                        renotify: true
                    });
                    delete notificationTimeouts.current[uniqueNotificationTag];
                    setNotificationSubscriptions(prev => {
                        const newState = new Set(prev);
                        newState.delete(item.id);
                        localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify(Array.from(newState)));
                        return newState;
                    });
                }, delay);
                console.log(`Web notificatie gepland voor '${item.title}' over ${Math.round(delay / 1000 / 60)} minuten (Web Fallback).`);
            } else {
                console.log(`Web notificatie voor '${item.title}' is niet gepland omdat de tijd in het verleden ligt (Web Fallback).`);
                setNotificationSubscriptions(prev => {
                    const newState = new Set(prev);
                    if (newState.has(item.id)) {
                        newState.delete(item.id);
                        localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify(Array.from(newState)));
                    }
                    return newState;
                });
            }
        } else {
            console.warn(`Notificaties niet ondersteund of geweigerd voor '${item.title}' (Geen native bridge, geen web notificaties).`);
            showMessageBox(`Notificaties niet ondersteund of geweigerd voor '${item.title}'. Controleer app permissies.`);
        }
    }
  };

  const cancelScheduledNotification = (performanceId) => {
    // Probeer eerst de native notificatie te annuleren
    if (window.AndroidBridge && typeof window.AndroidBridge.cancelNativeNotification === 'function') {
        window.AndroidBridge.cancelNativeNotification(performanceId);
        console.log(`Native notificatie annuleringsverzoek verstuurd voor ID '${performanceId}'.`);
    } else {
        // Fallback voor web-notificaties (indien gepland via setTimeout)
        const uniqueNotificationTag = `notification-${performanceId}`;
        if (notificationTimeouts.current[uniqueNotificationTag]) {
            clearTimeout(notificationTimeouts.current[uniqueNotificationTag]);
            delete notificationTimeouts.current[uniqueNotificationTag];
            console.log(`Web notificatie geannuleerd voor ID '${performanceId}' (Web Fallback).`);
        }
    }
  };

  const toggleFavorite = (itemObject, e) => {
    e.stopPropagation();
    const uniqueKey = itemObject.id;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(uniqueKey)) {
      newFavorites.delete(uniqueKey);
      // Als er een notificatie is geabonneerd voor deze favoriet, annuleer deze dan
      if (notificationSubscriptions.has(uniqueKey)) {
        const updatedNotificationSubscriptions = new Set(notificationSubscriptions);
        updatedNotificationSubscriptions.delete(uniqueKey);
        setNotificationSubscriptions(updatedNotificationSubscriptions);
        localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify(Array.from(updatedNotificationSubscriptions)));
        cancelScheduledNotification(uniqueKey); // Annuleer nu ook de native notificatie
      }
      console.log(`'${uniqueKey}' verwijderd uit favorieten (lokaal).`);
    } else {
      newFavorites.add(uniqueKey);
      console.log(`'${uniqueKey}' toegevoegd aan favorieten (lokaal).`);
    }
    setFavorites(newFavorites);
    localStorage.setItem('ctfTimetableFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  const toggleNotificationSubscription = (itemObject, e) => {
      e.stopPropagation();
      const uniqueKey = itemObject.id;
      const newNotificationSubscriptions = new Set(notificationSubscriptions);
      if (newNotificationSubscriptions.has(uniqueKey)) {
          newNotificationSubscriptions.delete(uniqueKey);
          cancelScheduledNotification(uniqueKey);
          console.log(`'${uniqueKey}' afgemeld voor notificaties (lokaal).`);
      } else {
          newNotificationSubscriptions.add(uniqueKey);
          scheduleActualNotification(itemObject);
          console.log(`'${uniqueKey}' geabonneerd voor notificaties (lokaal).`);
      }
      setNotificationSubscriptions(newNotificationSubscriptions);
      localStorage.setItem('ctfNotificationSubscriptions', JSON.stringify(Array.from(newNotificationSubscriptions)));
  };

  const addToGoogleCalendar = (e, title, date, time, location) => {
    e.stopPropagation();

    const dateString = String(date || '').trim();
    const timeString = String(time || '').trim();

    let parsedDay = NaN, parsedMonth = NaN, parsedYear = NaN;
    const monthNamesFull = {
      'januari': 1, 'februari': 2, 'maart': 3, 'april': 4, 'mei': 5, 'juni': 6,
      'juli': 7, 'augustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'december': 12
    };
    const monthNamesAbbr = {
      'jan': 1, 'feb': 2, 'mrt': 3, 'apr': 4, 'mei': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'okt': 10, 'nov': 11, 'dec': 12
    };

    const dashParts = dateString.split('-');
    if (dashParts.length === 3) {
      const monthPart = dashParts[1?.toLowerCase()];
      if (!isNaN(parseInt(monthPart, 10))) {
        parsedDay = parseInt(dashParts[0], 10);
        parsedMonth = parseInt(monthPart, 10);
        parsedYear = parseInt(dashParts[2], 10);
      } else if (monthNamesAbbr[monthPart]) {
        parsedDay = parseInt(dashParts[0], 10);
        parsedMonth = monthNamesAbbr[monthPart];
        parsedYear = parseInt(dashParts[2], 10);
      }
    }

    if (isNaN(parsedDay) || isNaN(parsedMonth) || isNaN(parsedYear)) {
        const spaceParts = dateString.split(' ');
        if (spaceParts.length === 3) {
            const monthFromText = monthNamesFull[spaceParts[1]?.toLowerCase()] || monthNamesAbbr[spaceParts[1]?.toLowerCase()];
            if (monthFromText) {
                parsedDay = parseInt(spaceParts[0], 10);
                parsedMonth = monthFromText;
                parsedYear = parseInt(spaceParts[2], 10);
            }
        }
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const finalDay = (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) ? currentDay : parsedDay;
    const finalMonth = (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) ? currentMonth : parsedMonth;
    const finalYear = (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) ? currentYear : parsedYear;

    const hours = parseInt(timeString.split(':')[0] ?? '', 10);
    const minutes = parseInt(timeString.split(':')[1] ?? '', 10);
    const finalHours = (isNaN(hours) || hours < 0 || hours > 23) ? 0 : hours;
    const finalMinutes = (isNaN(minutes) || minutes < 0 || minutes > 59) ? 0 : minutes;

    const startDate = new Date(finalYear, finalMonth - 1, finalDay, finalHours, finalMinutes);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    if (isNaN(startDate.getTime())) {
      console.error("addToGoogleCalendar: Fout: Ongeldige datum gecreëerd. Kan niet toevoegen aan agenda.");
      return;
    }

    const formatForGoogleCalendar = (d) => {
      const pad = (num) => num < 10 ? '0' + num : '' + num;
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    const formattedStartDate = formatForGoogleCalendar(startDate);
    const formattedEndDate = formatForGoogleCalendar(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent('Locatie: ' + location)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
  };

  const handleIconMouseEnter = (e, content) => {
    setCustomTooltipContent(content);
    setCustomTooltipPosition({
        x: e.clientX + 15,
        y: e.clientY + 15
    });
    setShowCustomTooltip(true);
  };

  const handleIconMouseLeave = () => {
    setShowCustomTooltip(false);
    setCustomTooltipContent('');
  };

  useEffect(() => {
    fetchTimetableData();
  }, []);

  return (
    <div className="min-h-screen bg-[#20747f] font-sans text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 relative pb-48"> {/* Changed pb-32 to pb-48 for more bottom space */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      <style>
        {`.font-oswald {
          font-family: 'Oswald', sans-serif;
        }
        `}
      </style>

      <AppHeader
        language={language}
        handleLanguageChange={handleLanguageChange}
        setShowPrivacyPolicy={setShowPrivacyPolicy}
        translations={translations}
      />

      <EventNavigation
        loading={loading}
        error={error}
        uniqueEvents={uniqueEvents}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSelectedEvent={setSelectedEvent}
        setSearchTerm={setSearchTerm}
        timetableData={timetableData}
        setSelectedDate={setSelectedDate}
        translations={translations}
        selectedEvent={selectedEvent}
        language={language}
      />

      <DateNavigation
        loading={loading}
        error={error}
        datesForCurrentSelectedEvent={datesForCurrentSelectedEvent}
        visibleDatesForEvent={visibleDatesForEvent}
        hiddenDatesForEvent={hiddenDatesForEvent}
        showMoreDates={showMoreDates}
        setShowMoreDates={setShowMoreDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSearchTerm={setSearchTerm}
        translations={translations}
        language={language}
        currentView={currentView}
      />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentView={currentView}
        selectedEvent={selectedEvent}
        translations={translations}
        language={language}
      />

      {/* TimetableDisplay component is verantwoordelijk voor het weergeven van laadstatus, fouten en gegevens */}
      <TimetableDisplay
        loading={loading}
        error={error}
        displayedTimetableData={displayedTimetableData}
        currentView={currentView}
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
        selectedEvent={selectedEvent}
        searchTerm={searchTerm}
        showMessageBox={showMessageBox} // Pass showMessageBox here
      />

      {/* Pay What You Can Afbeelding - Nu onder de timetable display */}
      {!loading && !error && (
        <div className="mt-8 mb-8 w-full max-w-[15.75rem] px-4 cursor-pointer mx-auto" onClick={() => openContentPopup('text', translations[language].payWhatYouCan)}>
          <img
            src="PWYC.jpg"
            alt="[Image of Pay What You Can text]"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      <PopupModal
        showPopup={showPopup}
        closePopup={closePopup}
        popupContent={popupContent}
        language={language}
        translations={translations}
      />

      <PrivacyPolicyModal
        showPrivacyPolicy={showPrivacyPolicy}
        setShowPrivacyPolicy={setShowPrivacyPolicy}
        language={language}
        renderPrivacyPolicyContent={renderPrivacyPolicyContent}
        translations={translations}
      />

      <CustomTooltip
        showCustomTooltip={showCustomTooltip}
        customTooltipContent={customTooltipContent}
        customTooltipPosition={customTooltipPosition}
      />

      <MessageBox
        message={messageBoxContent}
        show={messageBoxShow}
        onClose={closeMessageBox}
      />

      {/* "Wordt stamgast!" button aan de onderkant van de pagina */}
      <FooterButtons
        openContentPopup={openContentPopup}
        language={language}
        translations={translations}
        showPopup={showPopup}
      />
    </div>
  );
};

export default App;
