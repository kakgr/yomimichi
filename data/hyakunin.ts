export type HyakuninPoem = {
  number: number;
  category: string;
  author: string;
  authorReading: string;
  upperKanji: string;
  lowerKanji: string;
  upperKana: string;
  lowerKana: string;
  translation: string;
  wordplay: readonly (
    | { kind: "掛詞"; term: string; explanation: string }
    | { kind: "枕詞"; term: string; target: string; explanation: string }
  )[];
  notes: readonly string[];
};

/** 言文.xlsx の百人一首 8〜18番。上下の句は表の2行を結合して収録。 */
export const hyakuninPoems: readonly HyakuninPoem[] = [
  {
    number: 8, category: "雑", author: "喜撰法師", authorReading: "きせんほうし",
    upperKanji: "我が庵は　都のたつみ　しかぞ住む",
    lowerKanji: "世をうぢ山と　人はいふなり",
    upperKana: "わがいほは　みやこのたつみ　しかぞすむ",
    lowerKana: "よをうぢやまと　ひとはいふなり",
    translation: "わたしの小屋は都の東南にあり、このように穏やかに暮らしています。世間の人は、私が世の中を嫌になって山に住んでいると言うようですが。",
    wordplay: [{ kind: "掛詞", term: "しか", explanation: "鹿／しかぞ（このように）" }, { kind: "掛詞", term: "うぢ", explanation: "宇治／憂し（つらい）" }],
    notes: ["たつみ（辰巳）：東南", "庵：出家した人が住む質素な小屋", "作者は六歌仙の一人"],
  },
  {
    number: 9, category: "春", author: "小野小町", authorReading: "おののこまち",
    upperKanji: "花の色は　移りにけりな　いたづらに",
    lowerKanji: "わが身世にふる　ながめせし間に",
    upperKana: "はなのいろは　うつりにけりな　いたづらに",
    lowerKana: "わがみよにふる　ながめせしまに",
    translation: "桜の花の色は、長雨にあたるうちに色あせてしまった。私も物思いにふける間に、美しい時を過ぎてしまった。",
    wordplay: [{ kind: "掛詞", term: "ふる", explanation: "雨が降る／時が経る" }, { kind: "掛詞", term: "ながめ", explanation: "長雨／眺め（物思いにふける）" }],
    notes: ["花の色：桜と自分の若さ・美しさ", "いたづらに：むなしく", "作者は六歌仙の一人"],
  },
  {
    number: 10, category: "雑", author: "蝉丸", authorReading: "せみまる",
    upperKanji: "これやこの　行くも帰るも　別れては",
    lowerKanji: "知るも知らぬも　逢坂の関",
    upperKana: "これやこの　ゆくもかへるも　わかれては",
    lowerKana: "しるもしらぬも　あふさかのせき",
    translation: "これがうわさに聞く、都を出る人も帰る人も、知っている人も知らない人も出会い、別れるという逢坂の関なのか。",
    wordplay: [{ kind: "掛詞", term: "逢坂", explanation: "地名の逢坂／人と逢う" }],
    notes: ["これやこの：これがあのうわさの", "『行くも帰るも』『知るも知らぬも』は対句"],
  },
  {
    number: 11, category: "旅", author: "参議篁（小野篁）", authorReading: "さんぎたかむら（おののたかむら）",
    upperKanji: "わたの原　八十島かけて　こぎ出でぬと",
    lowerKanji: "人には告げよ　あまのつり舟",
    upperKana: "わたのはら　やそしまかけて　こぎいでぬと",
    lowerKana: "ひとにはつげよ　あまのつりぶね",
    translation: "広い海原を、たくさんの島を目指してこぎ出したと、みんなに伝えておくれ。漁師の釣り舟よ。",
    wordplay: [],
    notes: ["わたの原：広く果てしない海", "八十島：瀬戸内海にある多くの島", "あまのつり舟：漁師の舟"],
  },
  {
    number: 12, category: "雑", author: "僧正遍昭", authorReading: "そうじょうへんじょう",
    upperKanji: "天つ風　雲の通ひ路　吹きとぢよ",
    lowerKanji: "おとめの姿　しばしとどめむ",
    upperKana: "あまつかぜ　くものかよひぢ　ふきとぢよ",
    lowerKana: "をとめのすがた　しばしとどめむ",
    translation: "空を吹く風よ。天女たちが帰る雲の中の道を閉ざしておくれ。その姿をもう少し見ていたいから。",
    wordplay: [],
    notes: ["天つ風：空を吹く風", "雲の通ひ路：雲の中の通り道", "おとめの姿：五節の舞の舞姫", "作者は六歌仙の一人"],
  },
  {
    number: 13, category: "恋", author: "陽成院", authorReading: "ようぜいいん",
    upperKanji: "筑波嶺の　峰より落つる　みな川",
    lowerKanji: "恋ぞつもりて　淵となりぬる",
    upperKana: "つくばねの　みねよりおつる　みなのがは",
    lowerKana: "こひぞつもりて　ふちとなりぬる",
    translation: "筑波山の峰から流れ落ちるみなの川のように、私の恋心も積もって、深い淵のようになった。",
    wordplay: [],
    notes: ["筑波嶺：恋の歌にも詠まれる筑波山", "みなの川：筑波山から流れる川", "淵：流れが緩やかで深い所"],
  },
  {
    number: 14, category: "恋", author: "河原左大臣（源融）", authorReading: "かわらのさだいじん（みなもとのとおる）",
    upperKanji: "陸奥の　しのぶもぢずり　誰ゆゑに",
    lowerKanji: "乱れそめにし　我ならなくに",
    upperKana: "みちのくの　しのぶもぢずり　たれゆゑに",
    lowerKana: "みだれそめにし　われならなくに",
    translation: "しのぶもぢずりの模様のように私の心が乱れ始めたのは、私自身のせいではなく、あなたを思っているからです。",
    wordplay: [{ kind: "掛詞", term: "そめ", explanation: "染め／初め（なれ初め）" }],
    notes: ["陸奥：今の東北地方の東側", "しのぶもぢずり：福島県の信夫地方で作られた染め物"],
  },
  {
    number: 15, category: "春", author: "光孝天皇", authorReading: "こうこうてんのう",
    upperKanji: "君がため　春の野に出でて　若菜つむ",
    lowerKanji: "わが衣手に　雪は降りつつ",
    upperKana: "きみがため　はるののにいでて　わかなつむ",
    lowerKana: "わがころもでに　ゆきはふりつつ",
    translation: "あなたのために早春の野原へ出て若菜を摘みます。私の袖には雪が降りかかっています。",
    wordplay: [],
    notes: ["若菜：春の初めに芽を出す食用の草", "衣手：着物の袖"],
  },
  {
    number: 16, category: "離", author: "中納言行平", authorReading: "ちゅうなごんゆきひら",
    upperKanji: "立ち別れ　いなばの山の　峰に生ふる",
    lowerKanji: "まつとし聞かば　今帰り来む",
    upperKana: "たちわかれ　いなばのやまの　みねにおふる",
    lowerKana: "まつとしきかば　いまかへりこむ",
    translation: "これから別れて因幡へ行きますが、みんなが私を待つと聞けば、すぐに帰ってきます。",
    wordplay: [{ kind: "掛詞", term: "いなば", explanation: "因幡／往なば（行ってしまえば）" }, { kind: "掛詞", term: "まつ", explanation: "松／待つ" }],
    notes: ["いなばの山：現在の鳥取県にある山"],
  },
  {
    number: 17, category: "秋", author: "在原業平朝臣", authorReading: "ありわらのなりひらあそん",
    upperKanji: "ちはやぶる　神代も聞かず　竜田川",
    lowerKanji: "からくれなゐに　水くくるとは",
    upperKana: "ちはやぶる　かみよもきかず　たつたがは",
    lowerKana: "からくれなゐに　みづくくるとは",
    translation: "不思議なことの多かった神代にも聞いたことがない。竜田川が紅葉で真っ赤に染まり、まるで水をしぼり染めにしたようだとは。",
    wordplay: [{ kind: "枕詞", term: "ちはやぶる", target: "神", explanation: "『神』にかかる枕詞" }],
    notes: ["神代：神々の時代", "竜田川：奈良県の紅葉の名所", "くくる：しぼり染めにする"],
  },
  {
    number: 18, category: "恋", author: "藤原敏行朝臣", authorReading: "ふじわらのとしゆきあそん",
    upperKanji: "住の江の　岸に寄る波　よるさへや",
    lowerKanji: "夢の通ひ路　人目よくらむ",
    upperKana: "すみのえの　きしによるなみ　よるさへや",
    lowerKana: "ゆめのかよひぢ　ひとめよくらむ",
    translation: "住の江の岸に寄る波のように、夜の夢の中でさえ、あなたは人目を気にして私を避けるのでしょうか。",
    wordplay: [],
    notes: ["住の江：現在の大阪市住吉区付近の海岸", "さへ：そのうえ、〜までも", "よくらむ：どうして避けるのでしょうか"],
  },
];
