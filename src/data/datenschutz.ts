/**
 * Datenschutzerklärung, erstellt vom Datenschutzbeauftragten des Vereins
 * (schwinge GmbH, Stand 23.10.2026) und unverändert übernommen.
 *
 * Diese Datei wird aus der gelieferten Word-Datei erzeugt. Änderungen am Text
 * gehören dorthin und nicht hierher – sonst gehen sie bei der nächsten Fassung
 * verloren.
 */

export type DatenschutzTeil = { titel: string; absaetze: string[] };
export type DatenschutzKapitel = { titel: string; teile: DatenschutzTeil[] };

export const datenschutzStand = "23. Oktober 2026";

export const datenschutzKapitel: DatenschutzKapitel[] = [
  {
    titel: "Datenschutz auf einen Blick",
    teile: [
      {
        titel: "Allgemeine Hinweise",
        absaetze: [
          "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.",
        ],
      },
      {
        titel: "Datenerfassung auf dieser Website",
        absaetze: [],
      },
      {
        titel: "Wer ist verantwortlich für die Datenerfassung auf dieser Website?",
        absaetze: [
          "Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.",
        ],
      },
      {
        titel: "Wie erfassen wir Ihre Daten?",
        absaetze: [
          "Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.",
          "Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.",
        ],
      },
      {
        titel: "Wofür nutzen wir Ihre Daten?",
        absaetze: [
          "Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen verarbeitet.",
        ],
      },
      {
        titel: "Welche Rechte haben Sie bezüglich Ihrer Daten?",
        absaetze: [
          "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.",
          "Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.",
        ],
      },
    ],
  },
  {
    titel: "Hosting",
    teile: [
      {
        titel: "",
        absaetze: ["Wir hosten die Inhalte unserer Website bei folgendem Anbieter:"],
      },
      {
        titel: "Hetzner",
        absaetze: [
          "Anbieter ist die Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen (nachfolgend Hetzner).",
          "Details entnehmen Sie der Datenschutzerklärung von Hetzner: https://www.hetzner.com/de/legal/privacy-policy/.",
          "Die Verwendung von Hetzner erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.",
        ],
      },
      {
        titel: "Auftragsverarbeitung",
        absaetze: [
          "Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.",
        ],
      },
    ],
  },
  {
    titel: "Allgemeine Hinweise und Pflichtinformationen",
    teile: [
      {
        titel: "Datenschutz",
        absaetze: [
          "Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.",
          "Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.",
          "Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.",
        ],
      },
      {
        titel: "Hinweis zur verantwortlichen Stelle",
        absaetze: [
          "Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:",
          "aed e.V.Olgastraße 13870180 StuttgartGermanywww.aed-stuttgart.de",
          "Telefon: +49 160 8894377E-Mail: info@aed-stuttgart.de",
          "Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.",
        ],
      },
      {
        titel: "Speicherdauer",
        absaetze: [
          "Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.",
        ],
      },
      {
        titel:
          "Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website",
        absaetze: [
          "Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser Datenschutzerklärung informiert.",
        ],
      },
      {
        titel: "Empfänger von personenbezogenen Daten",
        absaetze: [
          "Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten an Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten unserer Kunden nur auf Grundlage eines gültigen Vertrags über Auftragsverarbeitung weiter. Im Falle einer gemeinsamen Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung geschlossen.",
        ],
      },
      {
        titel: "Widerruf Ihrer Einwilligung zur Datenverarbeitung",
        absaetze: [
          "Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.",
        ],
      },
      {
        titel:
          "Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)",
        absaetze: [
          "WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).",
          "WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).",
        ],
      },
      {
        titel: "Beschwerderecht bei der zuständigen Aufsichtsbehörde",
        absaetze: [
          "Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.",
        ],
      },
      {
        titel: "Recht auf Datenübertragbarkeit",
        absaetze: [
          "Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.",
        ],
      },
      {
        titel: "Auskunft, Berichtigung und Löschung",
        absaetze: [
          "Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.",
        ],
      },
      {
        titel: "Recht auf Einschränkung der Verarbeitung",
        absaetze: [
          "Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:",
          "Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.",
          "Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.",
          "Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.",
          "Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.",
          "Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats verarbeitet werden.",
        ],
      },
      {
        titel: "SSL- bzw. TLS-Verschlüsselung",
        absaetze: [
          "Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.",
          "Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.",
        ],
      },
      {
        titel: "Widerspruch gegen Werbe-E-Mails",
        absaetze: [
          "Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.",
        ],
      },
    ],
  },
  {
    titel: "Datenerfassung auf dieser Website",
    teile: [
      {
        titel: "Server-Log-Dateien",
        absaetze: [
          "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:",
          "Browsertyp und Browserversion",
          "verwendetes Betriebssystem",
          "Referrer URL",
          "Hostname des zugreifenden Rechners",
          "Uhrzeit der Serveranfrage",
          "IP-Adresse",
          "Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.",
          "Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.",
        ],
      },
      {
        titel: "Kontaktformular",
        absaetze: [
          "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
          "Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.",
          "Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.",
        ],
      },
      {
        titel: "Anfrage per E-Mail, Telefon oder Telefax",
        absaetze: [
          "Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
          "Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.",
          "Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.",
        ],
      },
      {
        titel: "Registrierung auf dieser Website",
        absaetze: [
          "Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.",
          "Für wichtige Änderungen etwa beim Angebotsumfang oder bei technisch notwendigen Änderungen nutzen wir die bei der Registrierung angegebene E-Mail-Adresse, um Sie auf diesem Wege zu informieren.",
          "Die Verarbeitung der bei der Registrierung eingegebenen Daten erfolgt zum Zwecke der Durchführung des durch die Registrierung begründeten Nutzungsverhältnisses und ggf. zur Anbahnung weiterer Verträge (Art. 6 Abs. 1 lit. b DSGVO).",
          "Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange Sie auf dieser Website registriert sind und werden anschließend gelöscht. Gesetzliche Aufbewahrungsfristen bleiben unberührt.",
        ],
      },
      {
        titel: "Kommentarfunktion auf dieser Website",
        absaetze: [
          "Für die Kommentarfunktion auf dieser Seite werden neben Ihrem Kommentar auch Angaben zum Zeitpunkt der Erstellung des Kommentars, Ihre E-Mail-Adresse und, wenn Sie nicht anonym posten, der von Ihnen gewählte Nutzername gespeichert.",
        ],
      },
      {
        titel: "Speicherung der IP-Adresse",
        absaetze: [
          "Unsere Kommentarfunktion speichert die IP-Adressen der Nutzer, die Kommentare verfassen. Da wir Kommentare auf dieser Website nicht vor der Freischaltung prüfen, benötigen wir diese Daten, um im Falle von Rechtsverletzungen wie Beleidigungen oder Propaganda gegen den Verfasser vorgehen zu können.",
        ],
      },
      {
        titel: "Speicherdauer der Kommentare",
        absaetze: [
          "Die Kommentare und die damit verbundenen Daten werden gespeichert und verbleiben auf dieser Website, bis der kommentierte Inhalt vollständig gelöscht wurde oder die Kommentare aus rechtlichen Gründen gelöscht werden müssen (z. B. beleidigende Kommentare).",
        ],
      },
      {
        titel: "Rechtsgrundlage",
        absaetze: [
          "Die Speicherung der Kommentare erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können eine von Ihnen erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.",
        ],
      },
    ],
  },
  {
    titel: "Newsletter",
    teile: [
      {
        titel: "Newsletterdaten",
        absaetze: [
          "Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse und mit dem Empfang des Newsletters einverstanden sind. Weitere Daten werden nicht bzw. nur auf freiwilliger Basis erhoben. Für die Abwicklung der Newsletter nutzen wir Newsletterdiensteanbieter, die nachfolgend beschrieben werden.",
        ],
      },
      {
        titel: "Mailchimp mit deaktivierter Erfolgsmessung",
        absaetze: [
          "Diese Website nutzt die Dienste von Mailchimp für den Versand von Newslettern. Anbieter ist die Rocket Science Group LLC, 675 Ponce De Leon Ave NE, Suite 5000, Atlanta, GA 30308, USA.",
          "Mailchimp ist ein Dienst, mit dem u.a. der Versand von Newslettern organisiert werden kann. Wenn Sie Daten zum Zwecke des Newsletterbezugs eingeben (z. B. E-Mail-Adresse), werden diese auf den Servern von Mailchimp in den USA gespeichert. Wir haben die Erfolgsmessung bei Mailchimp deaktiviert, sodass Mailchimp ihr Verhalten beim Öffnen unserer Newsletter nicht auswerten wird.",
          "Wenn Sie nicht möchten, dass Ihre Daten an Mailchimp übertragen werden, müssen Sie den Newsletter abbestellen. Hierfür stellen wir in jeder Newsletternachricht einen entsprechenden Link zur Verfügung.",
          "Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit widerrufen, indem Sie den Newsletter abbestellen. Die Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.",
          "Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem Newsletter bei uns bzw. dem Newsletterdiensteanbieter gespeichert und nach der Abbestellung des Newsletters aus der Newsletterverteilerliste gelöscht. Daten, die zu anderen Zwecken bei uns gespeichert wurden, bleiben hiervon unberührt.",
          "Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier: https://mailchimp.com/eu-us-data-transfer-statement/ und https://mailchimp.com/legal/data-processing-addendum/#Annex_C_-_Standard_Contractual_Clauses.",
          "Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre E-Mail-Adresse bei uns bzw. dem Newsletterdiensteanbieter ggf. in einer Blacklist gespeichert, sofern dies zur Verhinderung künftiger Mailings erforderlich ist. Die Daten aus der Blacklist werden nur für diesen Zweck verwendet und nicht mit anderen Daten zusammengeführt. Dies dient sowohl Ihrem Interesse als auch unserem Interesse an der Einhaltung der gesetzlichen Vorgaben beim Versand von Newslettern (berechtigtes Interesse im Sinne des Art. 6 Abs. 1 lit. f DSGVO). Die Speicherung in der Blacklist ist zeitlich nicht befristet. Sie können der Speicherung widersprechen, sofern Ihre Interessen unser berechtigtes Interesse überwiegen.",
          "Näheres entnehmen Sie den Datenschutzbestimmungen von Mailchimp unter: https://mailchimp.com/legal/terms/.",
          "Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link: https://www.dataprivacyframework.gov/participant/7693.",
        ],
      },
      {
        titel: "Auftragsverarbeitung",
        absaetze: [
          "Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.",
        ],
      },
    ],
  },
  {
    titel: "Unsere Social-Media-Auftritte",
    teile: [
      {
        titel: "Diese Datenschutzerklärung gilt für folgende Social-Media-Auftritte",
        absaetze: [
          "https://www.facebook.com/aedStuttgart",
          "https://www.instagram.com/aed_stuttgart/",
          "https://www.linkedin.com/in/aed-stuttgart-e-v-421977101",
        ],
      },
      {
        titel: "Datenverarbeitung durch soziale Netzwerke",
        absaetze: [
          "Wir unterhalten öffentlich zugängliche Profile in sozialen Netzwerken. Die im Einzelnen von uns genutzten sozialen Netzwerke finden Sie weiter unten.",
          "Soziale Netzwerke wie Facebook, X etc. können Ihr Nutzerverhalten in der Regel umfassend analysieren, wenn Sie deren Website oder eine Website mit integrierten Social-Media-Inhalten (z. B. Like-Buttons oder Werbebannern) besuchen. Durch den Besuch unserer Social-Media-Präsenzen werden zahlreiche datenschutzrelevante Verarbeitungsvorgänge ausgelöst. Im Einzelnen:",
          "Wenn Sie in Ihrem Social-Media-Account eingeloggt sind und unsere Social-Media-Präsenz besuchen, kann der Betreiber des Social-Media-Portals diesen Besuch Ihrem Benutzerkonto zuordnen. Ihre personenbezogenen Daten können unter Umständen aber auch dann erfasst werden, wenn Sie nicht eingeloggt sind oder keinen Account beim jeweiligen Social-Media-Portal besitzen. Diese Datenerfassung erfolgt in diesem Fall beispielsweise über Cookies, die auf Ihrem Endgerät gespeichert werden oder durch Erfassung Ihrer IP-Adresse.",
          "Mit Hilfe der so erfassten Daten können die Betreiber der Social-Media-Portale Nutzerprofile erstellen, in denen Ihre Präferenzen und Interessen hinterlegt sind. Auf diese Weise kann Ihnen interessenbezogene Werbung in- und außerhalb der jeweiligen Social-Media-Präsenz angezeigt werden. Sofern Sie über einen Account beim jeweiligen sozialen Netzwerk verfügen, kann die interessenbezogene Werbung auf allen Geräten angezeigt werden, auf denen Sie eingeloggt sind oder eingeloggt waren.",
          "Bitte beachten Sie außerdem, dass wir nicht alle Verarbeitungsprozesse auf den Social-Media-Portalen nachvollziehen können. Je nach Anbieter können daher ggf. weitere Verarbeitungsvorgänge von den Betreibern der Social-Media-Portale durchgeführt werden. Details hierzu entnehmen Sie den Nutzungsbedingungen und Datenschutzbestimmungen der jeweiligen Social-Media-Portale.",
        ],
      },
      {
        titel: "Rechtsgrundlage",
        absaetze: [
          "Unsere Social-Media-Auftritte sollen eine möglichst umfassende Präsenz im Internet gewährleisten. Hierbei handelt es sich um ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO. Die von den sozialen Netzwerken initiierten Analyseprozesse beruhen ggf. auf abweichenden Rechtsgrundlagen, die von den Betreibern der sozialen Netzwerke anzugeben sind (z. B. Einwilligung im Sinne des Art. 6 Abs. 1 lit. a DSGVO).",
        ],
      },
      {
        titel: "Verantwortlicher und Geltendmachung von Rechten",
        absaetze: [
          "Wenn Sie einen unserer Social-Media-Auftritte (z. B. Facebook) besuchen, sind wir gemeinsam mit dem Betreiber der Social-Media-Plattform für die bei diesem Besuch ausgelösten Datenverarbeitungsvorgänge verantwortlich. Sie können Ihre Rechte (Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Beschwerde) grundsätzlich sowohl ggü. uns als auch ggü. dem Betreiber des jeweiligen Social-Media-Portals (z. B. ggü. Facebook) geltend machen.",
          "Bitte beachten Sie, dass wir trotz der gemeinsamen Verantwortlichkeit mit den Social-Media-Portal-Betreibern nicht vollumfänglich Einfluss auf die Datenverarbeitungsvorgänge der Social-Media-Portale haben. Unsere Möglichkeiten richten sich maßgeblich nach der Unternehmenspolitik des jeweiligen Anbieters.",
        ],
      },
      {
        titel: "Speicherdauer",
        absaetze: [
          "Die unmittelbar von uns über die Social-Media-Präsenz erfassten Daten werden von unseren Systemen gelöscht, sobald Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt. Gespeicherte Cookies verbleiben auf Ihrem Endgerät, bis Sie sie löschen. Zwingende gesetzliche Bestimmungen – insb. Aufbewahrungsfristen – bleiben unberührt.",
          "Auf die Speicherdauer Ihrer Daten, die von den Betreibern der sozialen Netzwerke zu eigenen Zwecken gespeichert werden, haben wir keinen Einfluss. Für Einzelheiten dazu informieren Sie sich bitte direkt bei den Betreibern der sozialen Netzwerke (z. B. in deren Datenschutzerklärung, siehe unten).",
        ],
      },
      {
        titel: "Ihre Rechte",
        absaetze: [
          "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Ihnen steht außerdem ein Recht auf Widerspruch, auf Datenübertragbarkeit und ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Ferner können Sie die Berichtigung, Sperrung, Löschung und unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.",
        ],
      },
      {
        titel: "Soziale Netzwerke im Einzelnen",
        absaetze: [],
      },
      {
        titel: "Facebook",
        absaetze: [
          "Wir verfügen über ein Profil bei Facebook. Anbieter dieses Dienstes ist die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland (nachfolgend Meta). Die erfassten Daten werden nach Aussage von Meta auch in die USA und in andere Drittländer übertragen.",
          "Wir haben mit Meta eine Vereinbarung über gemeinsame Verarbeitung (Controller Addendum) geschlossen. In dieser Vereinbarung wird festgelegt, für welche Datenverarbeitungsvorgänge wir bzw. Meta verantwortlich ist, wenn Sie unsere Facebook-Page besuchen. Diese Vereinbarung können Sie unter folgendem Link einsehen: https://www.facebook.com/legal/terms/page_controller_addendum.",
          "Sie können Ihre Werbeeinstellungen selbstständig in Ihrem Nutzer-Account anpassen. Klicken Sie hierzu auf folgenden Link und loggen Sie sich ein: https://www.facebook.com/settings?tab=ads.",
          "Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier: https://www.facebook.com/legal/EU_data_transfer_addendum und https://de-de.facebook.com/help/566994660333381.",
          "Details entnehmen Sie der Datenschutzerklärung von Facebook: https://www.facebook.com/about/privacy/.",
          "Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link: https://www.dataprivacyframework.gov/participant/4452",
        ],
      },
      {
        titel: "Instagram",
        absaetze: [
          "Wir verfügen über ein Profil bei Instagram. Anbieter dieses Dienstes ist die Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland.",
          "Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier: https://www.facebook.com/legal/EU_data_transfer_addendum und https://de-de.facebook.com/help/566994660333381.",
          "Details zu deren Umgang mit Ihren personenbezogenen Daten entnehmen Sie der Datenschutzerklärung von Instagram: https://privacycenter.instagram.com/policy/.",
          "Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link: https://www.dataprivacyframework.gov/participant/4452",
        ],
      },
      {
        titel: "LinkedIn",
        absaetze: [
          "Wir verfügen über ein Profil bei LinkedIn. Anbieter ist die LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. LinkedIn verwendet Werbecookies.",
          "Wenn Sie LinkedIn-Werbe-Cookies deaktivieren möchten, nutzen Sie bitte folgenden Link: https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out.",
          "Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details finden Sie hier: https://www.linkedin.com/legal/l/dpa und https://www.linkedin.com/legal/l/eu-sccs.",
          "Details zu deren Umgang mit Ihren personenbezogenen Daten entnehmen Sie der Datenschutzerklärung von LinkedIn: https://www.linkedin.com/legal/privacy-policy.",
          "Das Unternehmen verfügt über eine Zertifizierung nach dem „EU-US Data Privacy Framework“ (DPF). Der DPF ist ein Übereinkommen zwischen der Europäischen Union und den USA, der die Einhaltung europäischer Datenschutzstandards bei Datenverarbeitungen in den USA gewährleisten soll. Jedes nach dem DPF zertifizierte Unternehmen verpflichtet sich, diese Datenschutzstandards einzuhalten. Weitere Informationen hierzu erhalten Sie vom Anbieter unter folgendem Link: https://www.dataprivacyframework.gov/participant/5448",
        ],
      },
    ],
  },
];
