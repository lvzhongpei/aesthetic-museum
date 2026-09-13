/**
 * 研究档案 A —— 藏品 01–04
 *
 * 与 exhibits.js 分开是有意的：
 * exhibits.js 放的是「这一件藏品是什么」（主张、规则、失效条件、token），
 * 这里放的是「它从哪来、经历过什么」（编年、案例、人物、轶事）。
 * 两者的更新节奏完全不同——前者随设计判断变，后者随史料变。
 */

export default {
  bauhaus: {
    timeline: [
      { year: '1919', zh: '格罗皮乌斯在魏玛把美术学院与工艺美术学校合并，国立包豪斯成立。', en: 'Gropius merges the Weimar art academy with its school of applied arts; the Staatliches Bauhaus is founded.' },
      { year: '1923', zh: '第一次大型展览与号角屋落成，「艺术与技术：新的统一」正式成为纲领。', en: 'The first major exhibition and the Haus am Horn open; "Art and Technology: A New Unity" becomes the official programme.' },
      { year: '1925', zh: '迁往德绍。格罗皮乌斯设计的新校舍落成，玻璃幕墙与功能分区成为现代建筑的样板。', en: 'The school moves to Dessau; Gropius’s new building, with its glass curtain wall and functional zoning, becomes a prototype for modern architecture.' },
      { year: '1928', zh: '格罗皮乌斯辞职，汉内斯·迈耶接任，教学转向更激进的社会功能主义。', en: 'Gropius resigns; Hannes Meyer takes over and pushes teaching toward a more radical social functionalism.' },
      { year: '1930', zh: '密斯·凡·德·罗接任，把学校重心移向建筑教育。', en: 'Mies van der Rohe takes over and shifts the school’s centre of gravity toward architectural training.' },
      { year: '1933', zh: '在政治压力下关闭。师生流散至芝加哥、特拉维夫、乌尔姆与黑山学院。', en: 'Closed under political pressure. Its teachers and students disperse to Chicago, Tel Aviv, Ulm and Black Mountain College.' },
    ],
    works: [
      {
        title: { zh: '号角屋 Haus am Horn', en: 'Haus am Horn' },
        year: '1923',
        place: { zh: '德国 魏玛', en: 'Weimar, Germany' },
        note: { zh: '为展览而建的住宅样板，第一栋把包豪斯全部主张压进一栋房子的建筑。没有装饰、功能分区明确、家具由各工坊自制。', en: 'A model house built for the exhibition — the first building to compress every Bauhaus claim into one house. No ornament, strict functional zoning, furniture made in the school’s own workshops.' },
      },
      {
        title: { zh: '德绍包豪斯校舍', en: 'Bauhaus Building, Dessau' },
        year: '1925–26',
        place: { zh: '德国 德绍', en: 'Dessau, Germany' },
        note: { zh: '玻璃幕墙、非对称体量、按功能分翼。后来被国际风格全面继承，也成了它最容易被误读的一件作品——它看起来像风格，实际是功能推导的结果。', en: 'A glass curtain wall, asymmetric massing and wings divided by function. Later absorbed wholesale by the International Style — and its most misread work, since it looks like a style but is the output of functional reasoning.' },
      },
      {
        title: { zh: '瓦西里椅 Wassily Chair', en: 'Wassily Chair' },
        year: '1925',
        place: { zh: '德国 德绍', en: 'Dessau, Germany' },
        note: { zh: '马塞尔·布劳耶用自行车钢管做出第一把钢管椅：结构完全外露，材料不做任何掩饰。', en: 'Marcel Breuer makes the first tubular-steel chair from bicycle tubing: the structure is entirely exposed and the material admits to being what it is.' },
      },
      {
        title: { zh: '通用字体与全小写排印', en: 'Universal Type and lowercase typography' },
        year: '1925–1930',
        place: { zh: '德国 德绍', en: 'Dessau, Germany' },
        note: { zh: '赫伯特·拜尔设计的几何无衬线字体，主张放弃大写字母以节省排字成本。它没有流行，但它提出的问题今天还在。', en: 'Herbert Bayer’s geometric sans-serif, arguing for abolishing capitals to save composition cost. It did not catch on, but the question it raised is still open.' },
      },
    ],
    figures: [
      { name: 'Walter Gropius', zh: '格罗皮乌斯', role: { zh: '创办人 · 第一任校长', en: 'Founder · first director' }, note: { zh: '把美术学院与工艺学校合并，确立「艺术与技术的新统一」。', en: 'Merged the art academy with the school of applied arts and set the programme of art and technology as a new unity.' } },
      { name: 'Herbert Bayer', zh: '赫伯特·拜尔', role: { zh: '平面与字体', en: 'Graphic design · type' }, note: { zh: '主张放弃大写字母，设计通用字体，奠定包豪斯的视觉识别。', en: 'Argued for dropping capitals, designed the Universal typeface and established the school’s visual identity.' } },
      { name: 'Marianne Brandt', zh: '玛丽安娜·布兰特', role: { zh: '金属工坊', en: 'Metal workshop' }, note: { zh: '做出第一批可批量生产的金属灯具与器皿，是女性在包豪斯工艺工坊中最具代表性的一位。', en: 'Produced the first mass-producible metal lamps and vessels, and the most prominent woman in the school’s craft workshops.' } },
      { name: 'Josef Albers', zh: '约瑟夫·阿尔伯斯', role: { zh: '基础课 Vorkurs', en: 'Preliminary course' }, note: { zh: '用纸、玻璃与色彩实验教构成，后来把整套方法带到黑山学院与耶鲁。', en: 'Taught composition through paper, glass and colour experiments, then carried the whole method to Black Mountain College and Yale.' } },
    ],
    story: {
      zh: '1923 年，包豪斯办第一次大型展览，需要给赞助它的图林根州政府一个交代。他们在魏玛郊外盖了一栋样板房——号角屋。房子里没有一件装饰品，家具全部由各工坊自制，厨房被压缩到近乎实验台大小，卧室之间甚至没有门。本意是「未来住宅」的提案，参观者却在意见簿上写：住在里面大概会失眠。展览本身是成功的，它换来了续款；但号角屋也暴露了包豪斯最深的一道裂缝——格罗皮乌斯要用它证明工业可以救艺术，伊顿却认为它丢掉了手艺人的灵魂。两年后伊顿辞职，学校迁往德绍，走上了一条不再回头的路。',
      en: 'In 1923 the Bauhaus staged its first major exhibition and needed to justify itself to the Thuringian government that funded it. It built a model house on the edge of Weimar: the Haus am Horn. Not one ornament, every piece of furniture made in its own workshops, the kitchen compressed to the size of a laboratory bench, and no doors between the bedrooms. It was meant as a proposal for future housing; visitors wrote in the comment book that they would probably not sleep in it. The exhibition succeeded and the funding was renewed — but the house also exposed the school’s deepest fracture. Gropius wanted it to prove that industry could rescue art; Itten believed it had thrown away the craftsman’s soul. Two years later Itten resigned, the school moved to Dessau, and there was no turning back.',
    },
  },

  destijl: {
    timeline: [
      { year: '1917', zh: '范·杜斯堡在莱顿创办《De Stijl》杂志；蒙德里安画出第一批只由直线与三原色构成的画。', en: 'Van Doesburg founds the journal De Stijl in Leiden; Mondrian paints his first canvases reduced to straight lines and primaries.' },
      { year: '1918', zh: '里特维尔德加入团体，红蓝椅完成——二维构成第一次被装成家具。', en: 'Rietveld joins the group and completes the Red and Blue Chair — a two-dimensional composition built into furniture for the first time.' },
      { year: '1920', zh: '蒙德里安发表《新造型主义》，把已经画出来的东西写成规则。', en: 'Mondrian publishes Neo-Plasticism, writing the rules for what he had already painted.' },
      { year: '1923', zh: '范·杜斯堡在巴黎办展，风格派与达达、构成主义发生接触并开始互相渗透。', en: 'Van Doesburg exhibits in Paris; De Stijl comes into contact with Dada and Constructivism and begins to cross-pollinate.' },
      { year: '1924', zh: '施罗德住宅在乌得勒支建成：可滑动墙体与原色立面，风格派唯一完全实现的建筑。', en: 'The Schröder House is completed in Utrecht: sliding walls and a primary-coloured façade — the movement’s only fully realised building.' },
      { year: '1931', zh: '范·杜斯堡去世，团体随之终止。', en: 'Van Doesburg dies and the group dissolves with him.' },
    ],
    works: [
      {
        title: { zh: '红蓝椅 Red and Blue Chair', en: 'Red and Blue Chair' },
        year: '1917–18',
        place: { zh: '荷兰 乌得勒支', en: 'Utrecht, Netherlands' },
        note: { zh: '十三根方木加两块板，把蒙德里安的二维构成直接装成一个能坐的东西。原版是未上漆的木头，颜色是后来才加的。', en: 'Thirteen square rods and two boards, turning a Mondrian composition into something you can sit on. The original was unpainted wood; the colours came later.' },
      },
      {
        title: { zh: '施罗德住宅 Schröder House', en: 'Schröder House' },
        year: '1924',
        place: { zh: '荷兰 乌得勒支', en: 'Utrecht, Netherlands' },
        note: { zh: '一层的墙可以整面滑开，白天是开放空间、夜里变成若干房间。里特维尔德与委托人施罗德夫人共同设计。', en: 'The ground floor walls slide away entirely, open by day and partitioned into rooms by night. Designed jointly by Rietveld and his client, Truus Schröder.' },
      },
      {
        title: { zh: '蒙德里安的《构成》系列', en: 'Mondrian’s Compositions' },
        year: '1920s',
        place: { zh: '巴黎 / 纽约', en: 'Paris / New York' },
        note: { zh: '语法一经确立就几乎不再改动，此后三十年只是在同一套规则里调整比例——这在艺术史上极其罕见。', en: 'Once the grammar was fixed it barely changed; for thirty years he adjusted only proportions within the same rules — almost unheard of in art history.' },
      },
      {
        title: { zh: '《De Stijl》杂志', en: 'The journal De Stijl' },
        year: '1917–1932',
        place: { zh: '荷兰 莱顿', en: 'Leiden, Netherlands' },
        note: { zh: '刊物本身的版式就在演示风格派规则：黑线、悬殊的块面、克制的颜色。理论先于作品被传播。', en: 'The journal’s own layout demonstrates the rules: black rules, wildly unequal blocks, rationed colour. The theory travelled before the work did.' },
      },
    ],
    figures: [
      { name: 'Theo van Doesburg', zh: '范·杜斯堡', role: { zh: '创办者 · 理论家', en: 'Founder · theorist' }, note: { zh: '把风格派写成纲领，并一路推向包豪斯与巴黎。', en: 'Wrote De Stijl into a programme and carried it to the Bauhaus and Paris.' } },
      { name: 'Piet Mondrian', zh: '蒙德里安', role: { zh: '绘画', en: 'Painting' }, note: { zh: '把绘画压缩到直线与三原色，为新造型主义提供了全部图示。', en: 'Compressed painting to straight lines and primaries, supplying Neo-Plasticism with all of its images.' } },
      { name: 'Gerrit Rietveld', zh: '里特维尔德', role: { zh: '家具 · 建筑', en: 'Furniture · architecture' }, note: { zh: '红蓝椅与施罗德住宅；把纸上的构成落成可以坐、可以住的东西。', en: 'The Red and Blue Chair and the Schröder House — turning paper compositions into things you can sit in and live in.' } },
      { name: 'Bart van der Leck', zh: '巴特·范德莱克', role: { zh: '平面 · 早期色块语言', en: 'Graphic · early flat colour' }, note: { zh: '提供了平面化的色块处理方法，后因坚持保留具象形象而与团体分手。', en: 'Supplied the flattened colour-block method, then left the group over his insistence on keeping figurative elements.' } },
    ],
    story: {
      zh: '1924 年，范·杜斯堡在作品里引入了一条斜线。蒙德里安认为这是背叛——风格派的全部前提就是直角，斜线意味着动、意味着时间、意味着他花了七年才驱逐出去的那个世界。两人就此断交，蒙德里安此后从未与他说话。另一边，里特维尔德与委托人施罗德夫人合作盖完了那栋房子，她带着三个孩子住进去，一直住到 1985 年去世，整整六十年。她在遗嘱里把房子交给保护机构时提了一个条件：墙必须还能滑。一个运动主张在两个人的身上分出了两种结局——一个人为了守住定义而断交，另一个人为了守住定义，在一栋房子里住了六十年。',
      en: 'In 1924 Van Doesburg introduced a diagonal into his work. Mondrian read it as betrayal: the entire premise of De Stijl was the right angle, and a diagonal meant movement, meant time, meant the world he had spent seven years expelling. They never spoke again. On the other side of the movement, Rietveld finished the house with his client Truus Schröder and she moved in with three children and stayed for sixty years, until her death in 1985. When she left it to a preservation trust she attached one condition: the walls had to keep sliding. One movement, two endings — one man broke off a friendship to defend the definition, the other lived inside the definition for six decades.',
    },
  },

  artdeco: {
    timeline: [
      { year: '1922', zh: '图坦卡蒙墓开启，埃及的阶梯形、放射线与金色涌入欧洲装饰语汇。', en: 'Tutankhamun’s tomb is opened; Egyptian stepped forms, rays and gold flood into European ornament.' },
      { year: '1925', zh: '巴黎国际现代装饰与工业艺术博览会给这个风格定名，也定下了它的野心。', en: 'The Paris Exposition Internationale des Arts Décoratifs et Industriels Modernes names the style — and sets out its ambition.' },
      { year: '1926', zh: '鲁尔曼在巴黎办个人展，把家具做成只有极少数人买得起的品类。', en: 'Ruhlmann stages a solo exhibition in Paris, turning furniture into a category only a very few could afford.' },
      { year: '1930', zh: '克莱斯勒大厦完工，不锈钢尖顶成为装饰艺术在建筑上的最高音。', en: 'The Chrysler Building is completed; its stainless-steel crown becomes the style’s loudest architectural statement.' },
      { year: '1931', zh: '帝国大厦落成，装饰艺术在摩天楼上定型并被推向全球。', en: 'The Empire State Building opens, fixing the style onto the skyscraper and exporting it worldwide.' },
      { year: '1937', zh: '巴黎世博会上装饰艺术被现代主义取代，风格正式退潮。', en: 'At the 1937 Paris exposition Art Deco is displaced by modernism and the style recedes.' },
    ],
    works: [
      {
        title: { zh: '克莱斯勒大厦 Chrysler Building', en: 'Chrysler Building' },
        year: '1930',
        place: { zh: '美国 纽约', en: 'New York, USA' },
        note: { zh: '层叠拱券与不锈钢尖顶，把汽车的镀铬语言搬到摩天楼上——它同时是一件广告和一个纪念物。', en: 'Stepped arches and a stainless-steel crown carry the chrome language of the automobile onto a skyscraper — advertisement and monument at once.' },
      },
      {
        title: { zh: '洛克菲勒中心 Rockefeller Center', en: 'Rockefeller Center' },
        year: '1930–39',
        place: { zh: '美国 纽约', en: 'New York, USA' },
        note: { zh: '把装饰艺术从单栋建筑扩展成一整组城市建筑群，证明它不只适用于室内与器物。', en: 'Expanded Art Deco from a single building into an entire urban ensemble, proving it could work beyond interiors and objects.' },
      },
      {
        title: { zh: '鲁尔曼的漆艺家具', en: 'Ruhlmann’s lacquer furniture' },
        year: '1920s',
        place: { zh: '法国 巴黎', en: 'Paris, France' },
        note: { zh: '象牙、乌木与手工漆，定义了什么叫做「昂贵的几何」——装饰在这里不是附加物，而是主体。', en: 'Ivory, ebony and hand-applied lacquer define what expensive geometry means — here ornament is not an addition, it is the subject.' },
      },
      {
        title: { zh: '卡桑德拉的《北方快车》海报', en: 'Cassandre’s Nord Express poster' },
        year: '1927',
        place: { zh: '法国 巴黎', en: 'Paris, France' },
        note: { zh: '用几何把「速度」做成一个可以被排版的形状，广告字体从此脱离了手写传统。', en: 'Geometry turns speed into something that can be typeset; advertising lettering detaches from handwriting for good.' },
      },
    ],
    figures: [
      { name: 'Émile-Jacques Ruhlmann', zh: '鲁尔曼', role: { zh: '家具设计', en: 'Furniture' }, note: { zh: '把装饰艺术做成价格惊人的奢侈品，也让它背上了「只为少数人服务」的指责。', en: 'Made Art Deco into an eye-wateringly expensive luxury — and earned it the charge of serving only the few.' } },
      { name: 'William Van Alen', zh: '威廉·范阿伦', role: { zh: '建筑师', en: 'Architect' }, note: { zh: '克莱斯勒大厦；用一次不到两小时的顶升动作，赢得了纽约最高楼的竞赛。', en: 'The Chrysler Building; won New York’s tallest-building race with a lift operation that took under two hours.' } },
      { name: 'Erté', zh: '埃尔特', role: { zh: '时装 · 舞台设计', en: 'Fashion · stage design' }, note: { zh: '画出装饰艺术最典型的女性轮廓，也把这套线条推向剧院与杂志封面。', en: 'Drew Art Deco’s signature female silhouette and carried the line into theatre and magazine covers.' } },
      { name: 'A. M. Cassandre', zh: '卡桑德拉', role: { zh: '海报设计', en: 'Poster design' }, note: { zh: '用几何重塑广告字体，让海报第一次具备建筑般的体量感。', en: 'Rebuilt advertising lettering out of geometry, giving the poster an architectural sense of mass.' } },
    ],
    story: {
      zh: '1929 年的曼哈顿，两栋楼在比谁更高。对手的下曼哈顿银行大楼即将封顶，看起来胜券在握。范阿伦把克莱斯勒大厦的尖顶事先拆成几段藏在楼内，在 1929 年 10 月的一个上午，用不到两个小时把它逐段顶出屋顶，一举超过对手 37 米。人群在街上看着一根不锈钢尖顶凭空长出来，对手直到那一刻才知道自己输了。这个纪录只保持了十一个月——1931 年帝国大厦落成，把所有人一起超过。后人记住的是这场竞赛的荒诞，但装饰艺术的气质恰恰藏在里面：它不追求持久，它追求的是那个被看见的瞬间。',
      en: 'Manhattan, 1929: two buildings raced to be taller. The rival Bank of Manhattan was about to top out and looked certain to win. Van Alen had the Chrysler crown prefabricated and hidden inside the building, then one morning in October 1929 hoisted it through the roof in under two hours, taking the title by 37 metres. Crowds on the street watched a stainless-steel spire grow out of nothing, and the rival only learned it had lost at that moment. The record lasted eleven months: the Empire State Building opened in 1931 and beat everyone at once. What people remember is the absurdity of the race — but the temperament of Art Deco is buried inside it. It was never after permanence. It was after the instant of being seen.',
    },
  },

  swiss: {
    timeline: [
      { year: '1950', zh: 'Müller-Brockmann 与同事在苏黎世开设工作室，开始把网格从经验变成系统。', en: 'Müller-Brockmann and colleagues open a studio in Zürich and begin turning the grid from instinct into a system.' },
      { year: '1957', zh: 'Neue Haas Grotesk 在哈斯铸字厂问世——它就是后来的 Helvetica。', en: 'Neue Haas Grotesk is released by the Haas type foundry — the face later renamed Helvetica.' },
      { year: '1958', zh: 'Müller-Brockmann 创办《Neue Grafik》，国际主义第一次有了自己的刊物。', en: 'Müller-Brockmann founds Neue Grafik; the International Style finally has a journal of its own.' },
      { year: '1959', zh: '巴塞尔设计学院成为另一个中心，霍夫曼把对比与形式训练写进课程。', en: 'The Basel school becomes a second centre as Hofmann writes contrast and form training into the curriculum.' },
      { year: '1960s', zh: '被企业识别系统大规模采用，成为全球默认的排版语言。', en: 'Corporate identity systems adopt it wholesale; it becomes the world’s default typographic language.' },
      { year: '1970s', zh: '被后现代主义与波普公开反叛——反叛它的人用的是它教的工具。', en: 'Postmodernism and Pop rebel against it openly — using the very tools it taught them.' },
    ],
    works: [
      {
        title: { zh: '《贝多芬第九交响曲》海报', en: 'Beethoven Ninth Symphony poster' },
        year: '1955',
        place: { zh: '瑞士 苏黎世', en: 'Zürich, Switzerland' },
        note: { zh: '用一组同心圆弧表现音乐的结构，把数学化的网格推到极致，也证明了网格可以表达情绪。', en: 'Concentric arcs express musical structure, pushing the mathematical grid to its limit and proving it can carry emotion.' },
      },
      {
        title: { zh: 'Helvetica', en: 'Helvetica' },
        year: '1957',
        place: { zh: '瑞士 明兴施泰因', en: 'Münchenstein, Switzerland' },
        note: { zh: '中性无衬线，字腔紧凑、终端平切。它的野心是「没有性格」，结果成了最容易被识别的一种性格。', en: 'A neutral sans-serif with tight apertures and horizontal terminals. Its ambition was to have no character; it became one of the most recognisable characters of all.' },
      },
      {
        title: { zh: '《Neue Grafik》杂志', en: 'Neue Grafik' },
        year: '1958–1965',
        place: { zh: '瑞士 苏黎世', en: 'Zürich, Switzerland' },
        note: { zh: '方法第一次被系统化输出，同时用英文、法文、德文三语并置，本身就在演示「无国界」。', en: 'The first systematic export of the method — set in English, French and German side by side, the journal performed its own claim to be borderless.' },
      },
      {
        title: { zh: '苏黎世机场标识系统', en: 'Zürich Airport signage' },
        year: '1950s–60s',
        place: { zh: '瑞士 苏黎世', en: 'Zürich, Switzerland' },
        note: { zh: '把网格从纸面搬到真实空间里，人在移动中也能读——这是网格系统最严苛的一次考试。', en: 'The grid moved off paper into real space, where it has to be read while moving — the most demanding test the system ever faced.' },
      },
    ],
    figures: [
      { name: 'Josef Müller-Brockmann', zh: '米勒-布罗克曼', role: { zh: '平面 · 网格系统', en: 'Graphic · grid systems' }, note: { zh: '把网格写成方法并出版；同时也是《Neue Grafik》的主编。', en: 'Wrote the grid down as a method and published it, while editing Neue Grafik.' } },
      { name: 'Armin Hofmann', zh: '阿明·霍夫曼', role: { zh: '巴塞尔学派 · 教学', en: 'Basel school · teaching' }, note: { zh: '把黑与白、点与线的对比训练做成一门可传授的课。', en: 'Turned black-and-white, point-and-line contrast exercises into a teachable course.' } },
      { name: 'Max Bill', zh: '马克斯·比尔', role: { zh: '具体艺术 · 设计教育', en: 'Concrete art · design education' }, note: { zh: '延续包豪斯的方法论，创办乌尔姆设计学院，把理性设计制度化。', en: 'Continued the Bauhaus method and founded the Ulm school, institutionalising rational design.' } },
      { name: 'Emil Ruder', zh: '埃米尔·鲁德', role: { zh: '排印教学', en: 'Typography teaching' }, note: { zh: '把排印当成一门有规则、可教学的学科，而不是手感。', en: 'Treated typography as a rule-governed, teachable discipline rather than a matter of touch.' } },
    ],
    story: {
      zh: 'Helvetica 的名字是一场妥协。1957 年哈斯铸字厂推出 Neue Haas Grotesk，本意只是替换自家 1896 年的旧字。斯图加特的 D. Stempel 公司拿到国际销售权后，认为这个名字没法卖，想改成 Helvetia——拉丁语里的「瑞士」。哈斯方面觉得 Helvetia 是国名、太硬，最终折中成 Helvetica，意思是「瑞士的」。这个改名的后果有点讽刺：一套瑞士字模，被当成「中性、无国界」的国际字体卖到了全世界，而名字里唯一被删掉的东西，恰恰是「瑞士」。它从此成了那种最难以指认的字体——你每天看见它，几乎从不意识到。',
      en: 'Helvetica’s name was a compromise. In 1957 Haas released Neue Haas Grotesk, intended simply to replace the foundry’s own 1896 face. When D. Stempel in Stuttgart acquired the international rights, they judged the name unsellable and proposed Helvetia — Latin for Switzerland. Haas found Helvetia too hard, too much a country name; the two settled on Helvetica, meaning Swiss. The consequence is a small irony: a Swiss typeface sold worldwide as neutral and borderless, with the one thing removed from its name being Switzerland itself. It became the hardest kind of typeface to notice — you see it every day and almost never register it.',
    },
  },
};
