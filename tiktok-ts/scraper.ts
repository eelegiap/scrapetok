import { PlaywrightCrawler, Request } from "@crawlee/playwright";
import { Page } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
const MIN_COLLECTION_SIZE = 30;
// const urlsToProcess = [
//   "https://www.tiktok.com/tag/afd",
//   "https://www.tiktok.com/tag/afdsong",
//   "https://www.tiktok.com/@mutzurwahrheit90",
//   "https://www.tiktok.com/@alice_weidel_afd",
//   "https://www.tiktok.com/@muenzenmaier",
//   "https://www.tiktok.com/@maximilian_krah",
//   "https://www.tiktok.com/@miguel_klauss",
//   "https://www.tiktok.com/music/Originalton-7397674347915184929",
//   "https://www.tiktok.com/music/Originalton-7325539076818488096",
//   "https://www.tiktok.com/music/Originalton-7375784153096244000",
//   "https://www.tiktok.com/music/Ein-Volk-Vereint-AFD-Song-7383368569742051329",
//   "https://www.tiktok.com/tag/AlternativefürDeutschland",
//   "https://www.tiktok.com/tag/afddeutschland",
//   "https://www.tiktok.com/tag/afdwählen",
//   "https://www.tiktok.com/tag/afddemo ",
//   "https://www.tiktok.com/tag/unserlandzuerst",
//   "https://www.tiktok.com/tag/seischlauwählblau",
//   "https://www.tiktok.com/tag/AfDWähler",
//   "https://www.tiktok.com/tag/AfDPartei",
//   "https://www.tiktok.com/tag/AfDPolitik",
//   "https://www.tiktok.com/tag/DeutschlandZuerst",
//   "https://www.tiktok.com/tag/EuroAlternativen",
//   "https://www.tiktok.com/tag/Euroskepsis",
//   "https://www.tiktok.com/tag/afrfraktion",
// ];

// const fileContent = readFileSync("../afd_accts_12-5_0.txt", "utf-8");
// const urlsToProcess = fileContent
//   .split("\n")
//   .map((line) => line.trim())
//   .filter((line) => line !== "")
//   .map((line) => `https://www.tiktok.com/@${line}`);

// const urlsToProcess: string[] = [
//   "https://www.tiktok.com/@tino.chrupalla.afd",
//   "https://www.tiktok.com/@maximilian_krah",
//   "https://www.tiktok.com/@afdfraktionimbundestag",
//   "https://www.tiktok.com/@alice_weidel_afd",
//   "https://www.tiktok.com/@afd.bund",
//   "https://www.tiktok.com/@bjoernhoecke",
//   "https://www.tiktok.com/@mr_afd",
//   "https://www.tiktok.com/@junge_alternative_",
//   "https://www.tiktok.com/@brandner_afd",
//   "https://www.tiktok.com/@jan_nolte_bundestag",
//   "https://www.tiktok.com/@mary.khan94",
//   "https://www.tiktok.com/@afd.eu",
//   "https://www.tiktok.com/@mutzurwahrheit90",
//   "https://www.tiktok.com/@rene_springer",
//   "https://www.tiktok.com/@afd.demo.community",
//   "https://www.tiktok.com/@afd.osnabrueck",
//   "https://www.tiktok.com/@jaycurlz.99",
//   "https://www.tiktok.com/@heidireichinnek",
//   "https://www.tiktok.com/@teamolafscholz",
//   "https://www.tiktok.com/@merzcdu",
//   "https://www.tiktok.com/@sahra.wagenknecht",
//   "https://www.tiktok.com/@bmwk_habeck",
//   "https://www.tiktok.com/@c_lindner",
//   "https://www.tiktok.com/@afdfraktionimbundestag",
//   "https://www.tiktok.com/@miguel_klauss",
// ];

// const urlsToProcess = [
//   // "https://www.tiktok.com/@miguel_klauss",
//   // "https://www.tiktok.com/music/Originalton-7426396306194713377",
//   // "https://www.tiktok.com/@nicoleradke78/",
//   // "https://vm.tiktok.com/ZNeKKxTaD/",
//   // "https://www.tiktok.com/@nicoleradke78",
//   // "https://www.tiktok.com/@djv_sabrina",
//   // "https://www.tiktok.com/@mokinte",
//   // "https://vm.tiktok.com/ZNeKKXka5/",
//   // "https://vm.tiktok.com/ZNeKKVWfd/",
//   "https://www.tiktok.com/@emiliafester",
//   "https://www.tiktok.com/@andreas.stoch",
//   "https://www.tiktok.com/@muenzenmaier",
// ];

const urlsToProcess: string[] = [
  // "https://www.tiktok.com/@albrecht_glaser_mdb",
  // "https://www.tiktok.com/@alice_weidel_afd",
  // "https://www.tiktok.com/@beatrixvonstorchneu",
  // "https://www.tiktok.com/@bernd.schattner.mdb",
  // "https://www.tiktok.com/@brandesdirk",
  // "https://www.tiktok.com/@brandner_afd",
  // "https://www.tiktok.com/@carolin_bachmann_mdb",
  // "https://www.tiktok.com/@christian.wirth2",
  // "https://www.tiktok.com/@christinabaumafd",
  // "https://www.tiktok.com/@dietmar.friedhoff.mdb",
  // "https://www.tiktok.com/@dr_espendiller",
  // "https://www.tiktok.com/@dr.rainer.rothfuss",
  // "https://www.tiktok.com/@edgarnaujokmdb",
  // "https://www.tiktok.com/@enricokomning",
  // "https://www.tiktok.com/@eugen_schmidt.mdb",
  // "https://www.tiktok.com/@frank.rinck",
  // "https://www.tiktok.com/@gereonbollmann",
  // "https://www.tiktok.com/@gerold_otten",
  // "https://www.tiktok.com/@gerrithuy",
  // "https://www.tiktok.com/@goetzfroemming",
  // "https://www.tiktok.com/@gottfriedcurio",
  // "https://www.tiktok.com/@hannesgnauck",
  // "https://www.tiktok.com/@haraldweyel",
  // "https://www.tiktok.com/@jan_nolte_bundestag",
  // "https://www.tiktok.com/@janwenzelschmidt",
  // "https://www.tiktok.com/@joachim.wundrak",
  // "https://www.tiktok.com/@jochenhaug_mdb",
  // "https://www.tiktok.com/@joernkoenig_mdb",
  // "https://www.tiktok.com/@juergenbraunmdb",
  // "https://www.tiktok.com/@juergenpohlafd",
  // "https://www.tiktok.com/@karstenhilseafd",
  // "https://www.tiktok.com/@kaufmannm",
  // "https://www.tiktok.com/@kaygottschalk",
  // "https://www.tiktok.com/@kayuweziegler71",
  // "https://www.tiktok.com/@kleinwaechterafd",
  // "https://www.tiktok.com/@leiferikholm",
  // "https://www.tiktok.com/@malte.kaufmann",
  // "https://www.tiktok.com/@manfred.schiller.afd",
  // "https://www.tiktok.com/@marcbernhard",
  // "https://www.tiktok.com/@marcus_buehl",
  // "https://www.tiktok.com/@markusfrohnmaier",
  // "https://www.tiktok.com/@martin_hess_klartext",
  // "https://www.tiktok.com/@mikemoncsek.de",
  // "https://www.tiktok.com/@mr_afd",
  // "https://www.tiktok.com/@muenzenmaier",
  // "https://www.tiktok.com/@peterboehringerafd",
  // "https://www.tiktok.com/@peterfelser_mdb",
  // "https://www.tiktok.com/@protschkasposition",
  // "https://www.tiktok.com/@rene_springer",
  // "https://www.tiktok.com/@renebochmann",
  // "https://www.tiktok.com/@roger_beckamp",
  // "https://www.tiktok.com/@sichertdeutschland",
  // "https://www.tiktok.com/@stefan_keuter",
  // "https://www.tiktok.com/@steffenkotre",
  // "https://www.tiktok.com/@thomas.ehrhorn",
  // "https://www.tiktok.com/@tino.chrupalla.afd",
  // "https://www.tiktok.com/@tmpeterka_mdb",
  // "https://www.tiktok.com/@ulschzi2",
  // "https://www.tiktok.com/@volkermuenz_mdb",
  // "https://www.tiktok.com/@emiliafester",
  // "https://www.tiktok.com/@andreas.stoch",
  // "https://www.tiktok.com/music/Originalton-7366738213554244384",
  // "https://www.tiktok.com/music/Originalton-AfD-f%C3%BCr-Deutschland-%F0%9F%87%A9%F0%9F%87%AA%F0%9F%92%99-7347387854166280993",
  // "https://www.tiktok.com/music/Slowed Jacob and the Stone-7281125585051519775",
  // "https://www.tiktok.com/music/Originalton-7161875409814637317",
  "https://www.tiktok.com/music/Not Afraid-6841875237454252033",
  "https://www.tiktok.com/music/Originalton-7460536047118650134",
  "https://www.tiktok.com/music/original sound-7424963853812435745",
  "https://www.tiktok.com/music/original sound-7406420293446503201",
  "https://www.tiktok.com/music/Originalton-7424540500907313953",
  "https://www.tiktok.com/music/Originalton - Heidi Reichinnek, MdB-7426735836592474913",
  "https://www.tiktok.com/music/Originalton-7368840773733092128",
  "https://www.tiktok.com/music/Originalton - Afd-7265742712895916832",
  "https://www.tiktok.com/music/Originalton - Sebastian Münzenmaier-7338815509615430433",
  "https://www.tiktok.com/music/Originalton-7327317051848985376",
  "https://www.tiktok.com/music/Originalton-7145918870002404102",
  "https://www.tiktok.com/music/Originalton-7242735473754770202",
  "https://www.tiktok.com/music/Originalton-7274287627011181344",
  "https://www.tiktok.com/music/Originalton-7287322006591818529",
  "https://www.tiktok.com/music/Demise of a Nation-6778677554413832194",
  "https://www.tiktok.com/music/Originalton-7004750403170487045",
  "https://www.tiktok.com/music/Originalton-7450580691715083030",
  "https://www.tiktok.com/music/Originalton-7361853680659254048",
  "https://www.tiktok.com/music/Originalton-7094704196489939718",
  "https://www.tiktok.com/music/Originalton-7287202768207481632",
  "https://www.tiktok.com/music/Epic Inspiration-7116400670005872641",
  "https://www.tiktok.com/music/Originalton-7326964148159089441",
  "https://www.tiktok.com/music/Originalton-7266511681474415392",
  "https://www.tiktok.com/music/Originalton-7153651007250123526",
  "https://www.tiktok.com/music/Epic Music(863502)-6873501791145691137",
  "https://www.tiktok.com/music/Originalton-7396755992350804768",
  "https://www.tiktok.com/music/Originalton-7079078061043436293",
  "https://www.tiktok.com/music/Originalton-7091942723913009925",
  "https://www.tiktok.com/music/Originalton-7277845946594970401",
  "https://www.tiktok.com/music/Originalton-7216338563608120070",
  "https://www.tiktok.com/music/Originalton-7301678028668488481",
  "https://www.tiktok.com/music/Originalton-7330256116486458145",
  "https://www.tiktok.com/music/Originalton-7188975721852603141",
  "https://www.tiktok.com/music/Originalton-7436478778782599968",
  "https://www.tiktok.com/music/Originalton-7207861806585268998",
  "https://www.tiktok.com/music/Originalton-7273937916040137505",
  "https://www.tiktok.com/music/Originalton - aliceimkummerland-7432412885633436449",
  "https://www.tiktok.com/music/Originalton-7053852422523210501",
  "https://www.tiktok.com/music/Originalton-7175471231813421830",
  "https://www.tiktok.com/music/Originalton-7055782470176049926",
  "https://www.tiktok.com/music/Originalton-7358392130883029792",
  "https://www.tiktok.com/music/Originalton-7100558820291742469",
  "https://www.tiktok.com/music/original sound-7426386520279698208",
  "https://www.tiktok.com/music/Originalton-7283910725202479904",
  "https://www.tiktok.com/music/Originalton - Sebastian Münzenmaier-7417034956671224608",
  "https://www.tiktok.com/music/เสียงต้นฉบับ - บินเดี่ยว-7149146220827626267",
  "https://www.tiktok.com/music/Originalton - Heidi Reichinnek, MdB-7412935903124998944",
  "https://www.tiktok.com/music/Originalton-7376362676196870945",
  "https://www.tiktok.com/music/Originalton-7060197149631990534",
  "https://www.tiktok.com/music/Originalton-7372194486565210913",
  "https://www.tiktok.com/music/Originalton-7445623593546631958",
  "https://www.tiktok.com/music/Originalton-7297295796696533792",
  "https://www.tiktok.com/music/Originalton-7425530067654822689",
  "https://www.tiktok.com/music/Originalton-7208254720700058373",
  "https://www.tiktok.com/music/Originalton-7111003319060925189",
  "https://www.tiktok.com/music/Originalton-7034140146832329478",
  "https://www.tiktok.com/music/original sound-7434175122582063894",
  "https://www.tiktok.com/music/Originalton-7432581532671937312",
  "https://www.tiktok.com/music/Originalton-7313478260485065504",
  "https://www.tiktok.com/music/Originalton - AfD Sachsen-7310224829343681312",
  "https://www.tiktok.com/music/Originalton-7286872351302716192",
  "https://www.tiktok.com/music/Originalton-7107674595469069062",
  "https://www.tiktok.com/music/Originalton-7377439690636413728",
  "https://www.tiktok.com/music/Originalton-7326125558713027360",
  "https://www.tiktok.com/music/Originalton-7450436229465688854",
  "https://www.tiktok.com/music/Moment of Truth-7039422683184662529",
  "https://www.tiktok.com/music/Originalton-7459078468061219606",
  "https://www.tiktok.com/music/Originalton - AfD Fraktion-7226017908433210138",
  "https://www.tiktok.com/music/Originalton-7306089393353739041",
  "https://www.tiktok.com/music/The Kings Mind-7349206176192874498",
  "https://www.tiktok.com/music/Originalton - Alice Weidel-7408908256162106145",
  "https://www.tiktok.com/music/Originalton-7135153997492587269",
  "https://www.tiktok.com/music/Originalton-7049071578851625733",
  "https://www.tiktok.com/music/Originalton-7162141017322621702",
  "https://www.tiktok.com/music/Originalton-7444949483642751766",
  "https://www.tiktok.com/music/Stille Nacht, Heilige Nacht-6832966474546546690",
  "https://www.tiktok.com/music/Originalton-7306541229994380064",
  "https://www.tiktok.com/music/Originalton-7231988440458447643",
  "https://www.tiktok.com/music/Originalton-7262036538841320224",
  "https://www.tiktok.com/music/Originalton-7450963672254270230",
  "https://www.tiktok.com/music/Originalton-7329958973560376096",
  "https://www.tiktok.com/music/Originalton-7136611365132733190",
  "https://www.tiktok.com/music/Originalton-7374125931139140384",
  "https://www.tiktok.com/music/Originalton - AfD-Fraktion im Landtag MV-7234780286985276186",
  "https://www.tiktok.com/music/Originalton-7149496087291022086",
  "https://www.tiktok.com/music/Wir Haben Die Schnauze Voll-6794394361443387394",
  "https://www.tiktok.com/music/original sound-7324407079630949125",
  "https://www.tiktok.com/music/Cozy Vibes-7227637549387745281",
  "https://www.tiktok.com/music/Originalton-7284694027046357793",
  "https://www.tiktok.com/music/Originalton-7369966372203694880",
  "https://www.tiktok.com/music/original sound-7443155462679661334",
  "https://www.tiktok.com/music/Originalton-7454175671259417366",
  "https://www.tiktok.com/music/Originalton-7135882002443586309",
  "https://www.tiktok.com/music/Originalton-7102434843828505349",
  "https://www.tiktok.com/music/Originalton - Heidi Reichinnek, MdB-7455721292092787488",
  "https://www.tiktok.com/music/Originalton-7115089853699607301",
  "https://www.tiktok.com/music/Originalton-7436780140795792150",
  "https://www.tiktok.com/music/Originalton-7007746076622981894",
  "https://www.tiktok.com/music/Originalton-7441983954779589398",
  "https://www.tiktok.com/music/Originalton-7309790570849913632",
  "https://www.tiktok.com/music/Originalton-7231185134581156635",
  "https://www.tiktok.com/music/original sound-7308794447457028897",
  "https://www.tiktok.com/music/Originalton-7309157615296023328",
  "https://www.tiktok.com/music/Originalton-7168823547303955205",
  "https://www.tiktok.com/music/Originalton-7159227149412109061",
  "https://www.tiktok.com/music/Originalton-7285713569897876256",
  "https://www.tiktok.com/music/Originalton-7324357312369117984",
  "https://www.tiktok.com/music/Originalton-7034522571014359814",
  "https://www.tiktok.com/music/Originalton-7424187156924943136",
  "https://www.tiktok.com/music/Originalton-7133637545803401990",
  "https://www.tiktok.com/music/Originalton-7121977525282163461",
  "https://www.tiktok.com/music/Originalton-7362230022939134752",
  "https://www.tiktok.com/music/The Champion-7086103923752175617",
  "https://www.tiktok.com/music/Originalton-7114716825769741061",
  "https://www.tiktok.com/music/Originalton-7395288241865657121",
  "https://www.tiktok.com/music/Originalton-7010413587261295365",
  "https://www.tiktok.com/music/Originalton-7261664786394499867",
  "https://www.tiktok.com/music/Originalton - Afd-7271324190723099425",
  "https://www.tiktok.com/music/Originalton-7381829410564983585",
  "https://www.tiktok.com/music/Originalton-7303981176371284769",
  "https://www.tiktok.com/music/Originalton-7335180021495991073",
  "https://www.tiktok.com/music/Irgendwie irgendwo irgendwann-7231614699313269531",
  "https://www.tiktok.com/music/Originalton-7312452611922217760",
  "https://www.tiktok.com/music/Originalton-7246747143644384026",
  "https://www.tiktok.com/music/Originalton-7044440440040393477",
  "https://www.tiktok.com/music/Originalton - Björn Höcke-7290597160322599713",
  "https://www.tiktok.com/music/Originalton-7436772562165680918",
  "https://www.tiktok.com/music/Originalton-7083837110713371398",
  "https://www.tiktok.com/music/Originalton-7374851889198435104",
  "https://www.tiktok.com/music/Originalton-7435244826443959072",
  "https://www.tiktok.com/music/Close Eyes-6966581702034458626",
  "https://www.tiktok.com/music/Epic News-7226230926606501890",
  "https://www.tiktok.com/music/Originalton-7223780349092465414",
  "https://www.tiktok.com/music/original sound-7408115258667191073",
  "https://www.tiktok.com/music/Originalton-7315856952654842657",
  "https://www.tiktok.com/music/original sound-7326949423337032480",
  "https://www.tiktok.com/music/Originalton-7359205101120113440",
  "https://www.tiktok.com/music/Originalton-7425632669247081249",
  "https://www.tiktok.com/music/Originalton-7376723112291142432",
  "https://www.tiktok.com/music/Originalton-7248682445267143451",
  "https://www.tiktok.com/music/Originalton-7193045477988862726",
  "https://www.tiktok.com/music/Originalton-7347697742766574369",
  "https://www.tiktok.com/music/Originalton - AfD Sachsen-7350585872179661601",
  "https://www.tiktok.com/music/Originalton-7358916151337077537",
  "https://www.tiktok.com/music/Originalton-7117182327541025542",
  "https://www.tiktok.com/music/original sound - Heidi Reichinnek, MdB-7416325161404762913",
  "https://www.tiktok.com/music/Originalton-7306473694761732897",
  "https://www.tiktok.com/music/Funny-6927016038370428930",
  "https://www.tiktok.com/music/Originalton-7240012809185102618",
  "https://www.tiktok.com/music/Irgendwie, irgendwo, irgendwann-6705004371744131074",
  "https://www.tiktok.com/music/Originalton-7295426532913187616",
  "https://www.tiktok.com/music/Originalton-7096163281697622790",
  "https://www.tiktok.com/music/Originalton-7347717281557891873",
  "https://www.tiktok.com/music/Originalton-7350651549816818465",
  "https://www.tiktok.com/music/Aesthetic-7072513628145977346",
  "https://www.tiktok.com/music/Originalton-7412316792997710625",
  "https://www.tiktok.com/music/Originalton-7193423768826563333",
  "https://www.tiktok.com/music/Originalton-7350358810155813665",
  "https://www.tiktok.com/music/Originalton - AfD.NRW-7301740842949593888",
  "https://www.tiktok.com/music/Originalton-7101367521039371014",
  "https://www.tiktok.com/music/original sound-7418308930069039905",
  "https://www.tiktok.com/music/Originalton-7451718305733200662",
  "https://www.tiktok.com/music/Originalton-7129587427085470469",
  "https://www.tiktok.com/music/Originalton-7177611055097481989",
  "https://www.tiktok.com/music/Nikes On-7333214460566046722",
  "https://www.tiktok.com/music/Washing Machine Heart-6779429943144089602",
  "https://www.tiktok.com/music/Originalton-7349506414870186784",
  "https://www.tiktok.com/music/Originalton-7440854452761922326",
  "https://www.tiktok.com/music/-7225622321090939674",
  "https://www.tiktok.com/music/Originalton-7324736672582634273",
  "https://www.tiktok.com/music/Originalton-7081225557555317509",
  "https://www.tiktok.com/music/Write This Down (Instrumental)-6988190007181887489",
  "https://www.tiktok.com/music/Originalton-6959609227212000006",
  "https://www.tiktok.com/music/Epic-6863597258726705153",
  "https://www.tiktok.com/music/Originalton-7427140627843910432",
  "https://www.tiktok.com/music/original sound - Maximilian_Krah.AfD-7413417475561360160",
  "https://www.tiktok.com/music/original sound-7366677480563149601",
  "https://www.tiktok.com/music/original sound-7443899532881283862",
  "https://www.tiktok.com/music/original sound-7415003279869954848",
  "https://www.tiktok.com/music/Originalton-7300185981579430688",
  "https://www.tiktok.com/music/Originalton-7458950625859324694",
  "https://www.tiktok.com/music/Originalton-7008853057509362438",
  "https://www.tiktok.com/music/Originalton-7354028491698834209",
  "https://www.tiktok.com/music/Originalton-7454168218610141975",
  "https://www.tiktok.com/music/original sound-7411177675329030945",
  "https://www.tiktok.com/music/Originalton-7391467992616045344",
  "https://www.tiktok.com/music/Originalton-7460142772042877718",
  "https://www.tiktok.com/music/Originalton-7187797778137926405",
  "https://www.tiktok.com/music/Originalton-7057546069630044934",
  "https://www.tiktok.com/music/Originalton-7378241532798798624",
  "https://www.tiktok.com/music/Originalton-7275621191786760993",
  "https://www.tiktok.com/music/Originalton-7139225121671138054",
  "https://www.tiktok.com/music/Originalton-7375589899770710816",
  "https://www.tiktok.com/music/Originalton-7426396306194713377",
  "https://www.tiktok.com/music/Originalton-7307266742533851937",
  "https://www.tiktok.com/music/Originalton-7154041783614753542",
  "https://www.tiktok.com/music/Originalton-7140578945346423558",
  "https://www.tiktok.com/music/Original Sound-7225600842888940294",
  "https://www.tiktok.com/music/Originalton-7392642739836013344",
  "https://www.tiktok.com/music/Originalton-7040176217676434182",
  "https://www.tiktok.com/music/Originalton-7329912625118776097",
  "https://www.tiktok.com/music/Originalton-7349905445034789665",
  "https://www.tiktok.com/music/Originalton-7451165098550119190",
  "https://www.tiktok.com/music/Originalton-7318866913203211041",
  "https://www.tiktok.com/music/Originalton - AfD.NRW-7268340369724082977",
  "https://www.tiktok.com/music/Originalton-7410724830934223649",
  "https://www.tiktok.com/music/Originalton-7109939163232389894",
  "https://www.tiktok.com/music/Originalton-7434978723520858912",
  "https://www.tiktok.com/music/Originalton-6943301607509494534",
  "https://www.tiktok.com/music/Originalton-7259117713086335770",
  "https://www.tiktok.com/music/Originalton-7414821812044974880",
  "https://www.tiktok.com/music/Epic Music(842228)-6860551605071120386",
  "https://www.tiktok.com/music/Originalton-7251932049085385499",
  "https://www.tiktok.com/music/Originalton-7343675116859919136",
  "https://www.tiktok.com/music/Originalton-7042014969755454214",
  "https://www.tiktok.com/music/Originalton-7098220157260040965",
  "https://www.tiktok.com/music/Originalton-7098395190649473797",
  "https://www.tiktok.com/music/Originalton-7337438051733490464",
  "https://www.tiktok.com/music/Originalton-7277852412315683616",
  "https://www.tiktok.com/music/Originalton-7325473442789526305",
  "https://www.tiktok.com/music/Originalton-7413031244386028321",
  "https://www.tiktok.com/music/Originalton-7196009052228258565",
  "https://www.tiktok.com/music/Originalton-7440184071793527574",
  "https://www.tiktok.com/music/Culture Beat Mr. Vain-7373958400135514912",
  "https://www.tiktok.com/music/Originalton-7113195770631752453",
  "https://www.tiktok.com/music/Originalton-7115444155773389573",
  "https://www.tiktok.com/music/Originalton-7445703981705562902",
  "https://www.tiktok.com/music/Military-6862774517358413825",
  "https://www.tiktok.com/music/Originalton-7043353767299189509",
  "https://www.tiktok.com/music/Originalton-7346583369029503776",
  "https://www.tiktok.com/music/Originalton-7320170664797817632",
  "https://www.tiktok.com/music/Originalton-7150965896780073734",
  "https://www.tiktok.com/music/Originalton-7433142265944296225",
  "https://www.tiktok.com/music/Originalton-7213117585494575877",
  "https://www.tiktok.com/music/Originalton - Sebastian Münzenmaier-7235616345109449499",
  "https://www.tiktok.com/music/Originalton-7325036874476210976",
  "https://www.tiktok.com/music/Originalton-7389599918019529505",
  "https://www.tiktok.com/music/Originalton-7317232653097257761",
  "https://www.tiktok.com/music/Originalton-7339115118754155296",
  "https://www.tiktok.com/music/Originalton-7128836038893505286",
  "https://www.tiktok.com/music/Originalton - AfD im EU-Parlament-7441638596794583840",
  "https://www.tiktok.com/music/Originalton-7179249626275711750",
  "https://www.tiktok.com/music/Aleph Gesaffelstein-7233069655333882650",
  "https://www.tiktok.com/music/Originalton-7407505977304025888",
  "https://www.tiktok.com/music/Originalton-7346642811586923296",
  "https://www.tiktok.com/music/Originalton-7058616261701438214",
  "https://www.tiktok.com/music/Epic Music(812424)-6860550837941307394",
  "https://www.tiktok.com/music/Originalton - Björn Höcke-7244156996956916506",
  "https://www.tiktok.com/music/Originalton-7437869870513556246",
  "https://www.tiktok.com/music/Originalton-7170813783416326918",
  "https://www.tiktok.com/music/Originalton-7386575598174489376",
  "https://www.tiktok.com/music/Originalton-7322840975496088353",
  "https://www.tiktok.com/music/A Warrior-7086103919792785409",
  "https://www.tiktok.com/music/Originalton-7232275625241758490",
  "https://www.tiktok.com/music/original sound-7287571848374569760",
  "https://www.tiktok.com/music/Originalton - AfD für Deutschland 🇩🇪💙-7347387854166280993",
  "https://www.tiktok.com/music/Originalton-7442318377030732566",
  "https://www.tiktok.com/music/Originalton-7330689431987260193",
  "https://www.tiktok.com/music/Originalton - AfD.NRW-7200086617204509445",
  "https://www.tiktok.com/music/Originalton-7325731380616530721",
  "https://www.tiktok.com/music/Originalton-7307900374063926048",
  "https://www.tiktok.com/music/Originalton-7302758397542189857",
  "https://www.tiktok.com/music/Originalton-7386209025781746465",
  "https://www.tiktok.com/music/Originalton-7352490531974384416",
  "https://www.tiktok.com/music/Originalton-7078338923067493125",
  "https://www.tiktok.com/music/Originalton-7329969549210602273",
  "https://www.tiktok.com/music/Originalton-7130690111444241158",
  "https://www.tiktok.com/music/Originalton-7441159190304803606",
  "https://www.tiktok.com/music/Originalton - AfD Fraktion-7194862201848433414",
  "https://www.tiktok.com/music/Originalton-7183349764770745094",
  "https://www.tiktok.com/music/Originalton-7010289217955695365",
  "https://www.tiktok.com/music/Originalton-7457514477203065622",
  "https://www.tiktok.com/music/Originalton-7373726836265012000",
  "https://www.tiktok.com/music/Originalton-7192656823089269510",
  "https://www.tiktok.com/music/Originalton-7412297624872880929",
  "https://www.tiktok.com/music/Originalton-7418950040179346208",
  "https://www.tiktok.com/music/Stargazing (Slowed + Reverb)-7221312697249531906",
  "https://www.tiktok.com/music/Originalton-7265316588508416800",
  "https://www.tiktok.com/music/Originalton-7423826612196723489",
  "https://www.tiktok.com/music/Horror Music(850612)-6904659551602083842",
  "https://www.tiktok.com/music/Originalton - Sebastian Münzenmaier-7408980149934328608",
  "https://www.tiktok.com/music/original sound-7423439193156225824",
  "https://www.tiktok.com/music/Originalton-7073184748818008837",
  "https://www.tiktok.com/music/Originalton-7420068098260880160",
  "https://www.tiktok.com/music/Originalton-7262344649956199200",
  "https://www.tiktok.com/music/Originalton-7225536982561426202",
  "https://www.tiktok.com/music/Originalton-7195166438766693125",
  "https://www.tiktok.com/music/Originalton-7434455857709599520",
  "https://www.tiktok.com/music/Originalton-7388794568977697569",
  "https://www.tiktok.com/music/Originalton-7437444099584166688",
  "https://www.tiktok.com/music/VIBE-6774333338309101569",
  "https://www.tiktok.com/music/Originalton-7314600456406174497",
  "https://www.tiktok.com/music/Originalton-7457533191302957846",
  "https://www.tiktok.com/music/Originalton - AfD im EU-Parlament-7425014021178231585",
  "https://www.tiktok.com/music/Originalton-7404776997886380833",
  "https://www.tiktok.com/music/Originalton-7277534391034055457",
  "https://www.tiktok.com/music/Originalton-7346930589662055200",
  "https://www.tiktok.com/music/Originalton-7122088791753411333",
  "https://www.tiktok.com/music/Originalton-7450174537536211734",
  "https://www.tiktok.com/music/nhạc nền - contenvip-7274876531854297899",
  "https://www.tiktok.com/music/original sound-7429068055918971671",
  "https://www.tiktok.com/music/Originalton-7292066461593045793",
  "https://www.tiktok.com/music/Originalton-7002930120763640581",
  "https://www.tiktok.com/music/Originalton-7306570801260464929",
  "https://www.tiktok.com/music/Call Me Slowed-7221290773886306305",
  "https://www.tiktok.com/music/Originalton-7366724838717344545",
  "https://www.tiktok.com/music/Originalton-7443500287041669910",
  "https://www.tiktok.com/music/Originalton-7409362409716730657",
  "https://www.tiktok.com/music/Originalton - AfD.NRW-7200750411890871046",
  "https://www.tiktok.com/music/Originalton-7419038049093143329",
  "https://www.tiktok.com/music/Originalton-7444113451879811862",
  "https://www.tiktok.com/music/Originalton-7313093424193784608",
  "https://www.tiktok.com/music/Originalton-7283137603975531297",
  "https://www.tiktok.com/music/Originalton-7399360906318826272",
  "https://www.tiktok.com/music/Originalton-7064154901416594182",
  "https://www.tiktok.com/music/Originalton-7278271611206241056",
  "https://www.tiktok.com/music/original sound-7417054277920738080",
  "https://www.tiktok.com/music/Originalton-7133698407163595525",
  "https://www.tiktok.com/music/Originalton-7404026639589378849",
  "https://www.tiktok.com/music/original sound - AfD Sachsen-7271162987913022240",
  "https://www.tiktok.com/music/Originalton-7321692758372698912",
  "https://www.tiktok.com/music/Originalton-7375233492353764129",
  "https://www.tiktok.com/music/Originalton-7357389700442721057",
  "https://www.tiktok.com/music/Originalton-7273157090183809824",
  "https://www.tiktok.com/music/Originalton-7366738213554244384",
  "https://www.tiktok.com/music/Originalton-7005995203932867334",
  "https://www.tiktok.com/music/Originalton-7018962449290332933",
  "https://www.tiktok.com/music/som original-7335572506323700486",
  "https://www.tiktok.com/music/Originalton-7417889574670256928",
  "https://www.tiktok.com/music/Originalton-7252263282315135771",
  "https://www.tiktok.com/music/L'amour Toujours-6896819246290978817",
  "https://www.tiktok.com/music/son original-7213108949917207322",
  "https://www.tiktok.com/music/Originalton-7304800902123834144",
  "https://www.tiktok.com/music/Originalton-7454563658901293846",
  "https://www.tiktok.com/music/Originalton-7051675053964610310",
  "https://www.tiktok.com/music/Originalton-7173710376885881605",
  "https://www.tiktok.com/music/Originalton-7311728807218531105",
  "https://www.tiktok.com/music/Epical Dramatic Background-7378193317534730259",
  "https://www.tiktok.com/music/Originalton-7140142493156297478",
  "https://www.tiktok.com/music/Originalton-7391503850294774561",
  "https://www.tiktok.com/music/Originalton-7379666808817928992",
  "https://www.tiktok.com/music/Originalton-7141069485875776282",
  "https://www.tiktok.com/music/Originalton-7289529655743580961",
  "https://www.tiktok.com/music/Originalton-7442714783809374998",
  "https://www.tiktok.com/music/Originalton-7318443163862485793",
  "https://www.tiktok.com/music/Originalton-7175115591962200838",
  "https://www.tiktok.com/music/Originalton - AfD für Deutschland 🇩🇪💙-7277544673516849953",
  "https://www.tiktok.com/music/Originalton-7164473484196727557",
  "https://www.tiktok.com/music/Originalton-7247532907256875802",
  "https://www.tiktok.com/music/Originalton-7335129848588847905",
  "https://www.tiktok.com/music/Originalton - Björn Höcke-7286760184209558304",
  "https://www.tiktok.com/music/Originalton-7145161137977035525",
  "https://www.tiktok.com/music/Originalton-7434608608249531169",
  "https://www.tiktok.com/music/Originalton-7195238742062926598",
  "https://www.tiktok.com/music/Originalton-7227441591986801435",
  'https://www.tiktok.com/music/Metro boomin "cinderella"type beat - 伴奏-7359480001232111617',
  "https://www.tiktok.com/music/Originalton-7385127356043676449",
  "https://www.tiktok.com/music/Originalton-7194460736781814533",
  "https://www.tiktok.com/music/Originalton-7439869009283025686",
  'https://www.tiktok.com/music/Swan Lake "dance of four swans"-6817164555962025985',
  "https://www.tiktok.com/music/Originalton-7306490818264189729",
  "https://www.tiktok.com/music/Originalton-7326901666322516769",
  "https://www.tiktok.com/music/Originalton-7371547807523638049",
  "https://www.tiktok.com/music/Originalton-7449836126141745943",
  "https://www.tiktok.com/music/Originalton-7454627275953703702",
  "https://www.tiktok.com/music/Originalton-7304797219483552545",
  "https://www.tiktok.com/music/Originalton-7458009675122445078",
  "https://www.tiktok.com/music/Originalton-7403718985725774625",
  "https://www.tiktok.com/music/Originalton-7047231054377454342",
  "https://www.tiktok.com/music/Originalton-7169942412474141446",
  "https://www.tiktok.com/music/Originalton-7330946051853011744",
  "https://www.tiktok.com/music/Originalton-7137387711538776837",
  "https://www.tiktok.com/music/Originalton-7429230227538086678",
  "https://www.tiktok.com/music/Originalton-7334764955289979681",
  "https://www.tiktok.com/music/Originalton-7336207921133112096",
  "https://www.tiktok.com/music/Originalton-7218110440558086917",
  "https://www.tiktok.com/music/Originalton-7142743702241987334",
  "https://www.tiktok.com/music/Originalton-7239424722277010203",
  "https://www.tiktok.com/music/The Way I like it Techno Edit-7287906565338794785",
  "https://www.tiktok.com/music/Originalton-7284188253102689057",
  "https://www.tiktok.com/music/Originalton - AfD im EU-Parlament-7442389948043152160",
  "https://www.tiktok.com/music/Originalton-7434542338464140065",
  "https://www.tiktok.com/music/Originalton-7298763843986656033",
  "https://www.tiktok.com/music/Originalton-6980328645416061701",
  "https://www.tiktok.com/music/Originalton-7378874238906927904",
  "https://www.tiktok.com/music/Originalton-7247092575248190234",
  "https://www.tiktok.com/music/Originalton-7454535380953762582",
  "https://www.tiktok.com/music/Originalton - AfD Fraktion-7273870692373383969",
  "https://www.tiktok.com/music/Originalton-7378038626380155680",
  "https://www.tiktok.com/music/Originalton-7276167840780356384",
  "https://www.tiktok.com/music/Originalton-7042385084468579078",
  "https://www.tiktok.com/music/Originalton-7380665603033533216",
  "https://www.tiktok.com/music/sad sound-7157012176690792449",
  "https://www.tiktok.com/music/Originalton-7105458780179778310",
  "https://www.tiktok.com/music/Originalton-7429320241743661857",
  "https://www.tiktok.com/music/Originalton - NoAfD-7194146200995777286",
  "https://www.tiktok.com/music/Originalton - AfD Fraktion-7348779097016896289",
  "https://www.tiktok.com/music/Originalton-7381937314779155232",
  "https://www.tiktok.com/music/Originalton-7250134509977766682",
  "https://www.tiktok.com/music/Originalton-7280550700889688864",
  "https://www.tiktok.com/music/original sound-7436096308638796576",
  "https://www.tiktok.com/music/Originalton-7367770456331520801",
  "https://www.tiktok.com/music/Originalton-7327984866334919457",
  "https://www.tiktok.com/music/Originalton-7299813585579035425",
  "https://www.tiktok.com/music/Originalton-7312825209902435104",
  "https://www.tiktok.com/music/Originalton-7281950902796225312",
  "https://www.tiktok.com/music/Originalton-7407177501526772512",
  "https://www.tiktok.com/music/Originalton-7441972010684615447",
  "https://www.tiktok.com/music/Originalton-7330243820292721440",
  "https://www.tiktok.com/music/Originalton-7109854207791876869",
  "https://www.tiktok.com/music/Originalton-7189213403633371910",
  "https://www.tiktok.com/music/Originalton-6938923767603235589",
  "https://www.tiktok.com/music/Originalton-7059133334370257670",
];

const isHeadless = false;
const maxScrolls = 50;

function randBtwn(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getFilePath(id: string, pageUrl: string): string {
  let filename = id;
  let folder = "other";
  if (pageUrl.includes("tag")) {
    const tagName = pageUrl.split("/").pop();
    filename = `${id}_tag-${tagName}`;
    folder = "by_tag";
  }
  if (pageUrl.includes("@")) {
    folder = "by_user";
  }
  if (pageUrl.includes("music")) {
    const musicTitle = pageUrl.split("/").pop();
    filename = `${id}_music-${musicTitle}`;
    folder = "by_music";
  }
  return `../tiktok-data/${folder}/${filename}.json`;
}

async function scrollUsingDownKey(page: Page, scrollCount: number = 8) {
  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 4));
    await page.waitForTimeout(randBtwn(100, 500));
  }
}

async function filterCollectedUrls(
  urls: string[],
  intiialPageUrl: string
): Promise<string[]> {
  return urls.filter((url) => {
    const urlId = url.split("/").pop() || "";
    const filePath = getFilePath(urlId, intiialPageUrl);
    return urlId && !existsSync(filePath);
  });
}
async function urlCollectorCrawler(url: string): Promise<string[]> {
  const collectedUrls = new Set<string>(); // Use Set to store unique URLs

  const crawler = new PlaywrightCrawler({
    useSessionPool: true,
    persistCookiesPerSession: true,
    maxRequestRetries: 3,
    launchContext: {
      useIncognitoPages: true,
      launchOptions: {
        headless: isHeadless,
        args: ["--incognito"],
        viewport: { width: 500, height: 500 },
      },
    },
    requestHandlerTimeoutSecs: 300,
    maxConcurrency: 3,
    async requestHandler({ page, request }: { page: Page; request: Request }) {
      console.log(`Crawling ${request.url} for URLs...`);

      await page.waitForTimeout(randBtwn(3000, 5000));
      if (page.url().includes("https://www.tiktok.com/foryou")) {
        console.log(`ENDING SCRAPER DUE TO BAD REDIRECT ON ${url}`);
        return;
      }
      // Example pop-up and cookie acceptance handling
      try {
        const closeButton = await page.$('button[aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
          console.log("Popup closed.");
        }
      } catch (e) {
        console.log("Close button not found or could not be clicked:", e);
      }

      try {
        const declineButton = await page.$('button:text-is("Decline all")');
        if (declineButton) {
          await declineButton.click();
          console.log("Clicked 'Decline all' button.");
        }
        const declineOptButton = await page.$(
          'button:text-is("Decline optional cookies")'
        );
        if (declineOptButton) {
          await declineOptButton.click();
          console.log("Clicked 'Decline optional cookies' button.");
        }
      } catch (e) {
        console.log("Decline button not found or could not be clicked:", e);
      }

      await page.waitForTimeout(randBtwn(3000, 5000));

      let breakCollection = false;
      let startCt = 0;

      const diffs = [];
      for (let i = 0; i < maxScrolls; i++) {
        if (diffs.length > 2) {
          if (diffs.slice(-2).every((num) => num === 0)) {
            breakCollection = true;
          }
        }
        startCt = collectedUrls.size;
        if (breakCollection) {
          if (false) {
            // if (collectedUrls.size < MIN_COLLECTION_SIZE && url.includes("@")) {
            throw new Error(
              "Collection interrupted, no new elts found: Restarting scraper..."
            );
          } else {
            console.log("Not finding any new URLs, breaking");
            break;
          }
        }

        // e19c29qe13 e19c29qe7
        // await delay(randBtwn(25_000000, 35_000000));

        const elements = await page.$$(".css-1mdo0pl-AVideoContainer"); // Replace with actual class name

        for (const element of elements) {
          const href = await element.getAttribute("href");
          if (href) {
            collectedUrls.add(href);
            console.log(`Collected ${collectedUrls.size} links: ${href}`);
          }
        }

        await scrollUsingDownKey(page);
        console.log(`Waiting!`);
        await page.waitForTimeout(randBtwn(3000, 6000));
        console.log(`Scrolling down (${i + 1})`);

        diffs.push(collectedUrls.size - startCt);
      }
      console.log("Crawler 1 is done.");
    },
  });

  await crawler.run([url]);
  console.log(
    `URL collection complete. Collected ${collectedUrls.size} unique links.`
  );

  return Array.from(collectedUrls); // Convert Set to Array and return
}

async function visitCollectedUrlsCrawler(
  urls: string[],
  initialPageUrl: string
) {
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 5,
    async requestHandler({ page, request }: { page: Page; request: Request }) {
      console.log(`Visiting ${request.url}...`);
      await page.waitForTimeout(randBtwn(2000, 3000));

      const scriptElement = await page.$("#__UNIVERSAL_DATA_FOR_REHYDRATION__");
      if (scriptElement) {
        const jsonData = await scriptElement.textContent();

        if (jsonData) {
          try {
            const parsedData = JSON.parse(jsonData);
            const itemStruct =
              parsedData?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo
                ?.itemStruct;

            if (itemStruct) {
              const filePath = getFilePath(itemStruct.id, initialPageUrl);

              // Check if the file already exists
              if (!existsSync(filePath)) {
                writeFileSync(filePath, JSON.stringify(itemStruct, null, 2));
                console.log(`Data saved for ${itemStruct.id}`);
              } else {
                console.log(
                  `File already exists for ${itemStruct.id}, skipping save.`
                );
              }
            } else {
              console.log("itemStruct data not found in parsed JSON.");
            }
          } catch (error) {
            console.error("Failed to parse JSON data:", error);
          }
        } else {
          console.log("No JSON data found in the <script> tag.");
        }
      } else {
        console.log(
          "Script tag with ID '__UNIVERSAL_DATA_FOR_REHYDRATION__' not found."
        );
      }
    },
  });

  await crawler.run(urls);
  console.log("Second crawl complete for all URLs.");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processUrlsSequentially(urls: string[]) {
  for (const url of urls) {
    console.log(`Processing URL: ${url}`);

    // Step 1: Collect URLs from the first crawler
    const collectedUrls = await urlCollectorCrawler(url);
    await delay(randBtwn(30_000, 45_000));
    const filteredUrls = await filterCollectedUrls(collectedUrls, url);
    console.log(`Collected URLs: ${collectedUrls.length}`);
    console.log(`Filter URLs: ${filteredUrls.length}`);

    // Step 2: Visit each collected URL with the second crawler
    await visitCollectedUrlsCrawler(filteredUrls, url);
  }
}

(async () => {
  await processUrlsSequentially(urlsToProcess);
})();
