/* =============================================
   だるまや呉服店 チャットボット - ロジック
   ============================================= */

// ─── FAQデータベース ───
const FAQ_DATABASE = [
  // 店舗情報
  {
    keywords: ['営業時間', '何時', '開店', '閉店', 'オープン', '時間'],
    answer: '営業時間は **10:00～19:00** でございます。\nお気軽にご来店くださいませ。🕰️',
    category: '店舗情報'
  },
  {
    keywords: ['定休日', '休み', 'お休み', '休業'],
    answer: '毎週 **水曜日** が定休日でございます。\n祝日の場合は営業いたしますので、お気軽にお問い合わせください。📅',
    category: '店舗情報'
  },
  {
    keywords: ['場所', '住所', 'アクセス', '行き方', 'どこ', '最寄り駅', '駅'],
    answer: '大阪の **駒川商店街** 内にございます。🗺️\n\n最寄り駅は **大阪メトロ 駒川中野駅** です。\n商店街をお散歩しながらお越しいただけます。',
    category: '店舗情報'
  },
  {
    keywords: ['電話', 'tel', '電話番号', '連絡先'],
    answer: 'お電話でのお問い合わせはこちらです 📞\n\n**06-6692-2239**\n\n営業時間内にお気軽にお電話ください。',
    category: '店舗情報'
  },
  {
    keywords: ['駐車場', 'パーキング', '車'],
    answer: '専用駐車場のご用意はございませんが、商店街近くに **コインパーキング** が複数ございます。🚗\n\n公共交通機関でのお越しもおすすめです。',
    category: '店舗情報'
  },

  // 商品
  {
    keywords: ['振袖', 'ふりそで'],
    answer: '振袖は **成人式** をはじめ、結納やパーティーなど華やかなシーンにぴったりです。👘\n\n当店では、古典柄からモダンなデザインまで豊富に取り揃えております。\n**ご購入・レンタル** どちらも承っておりますので、ぜひ一度ご来店ください。',
    category: '商品'
  },
  {
    keywords: ['訪問着', 'ほうもんぎ'],
    answer: '訪問着は **結婚式・入学式・お茶会** など、幅広いシーンでお召しいただける万能な着物です。🌸\n\n上品な柄行きの訪問着を多数ご用意しております。',
    category: '商品'
  },
  {
    keywords: ['留袖', 'とめそで', '黒留袖', '色留袖'],
    answer: '留袖は **結婚式** で新郎新婦のお母様やご親族がお召しになる格式高い着物です。💎\n\n**黒留袖・色留袖** ともにご用意がございます。レンタルも承っております。',
    category: '商品'
  },
  {
    keywords: ['小紋', 'こもん'],
    answer: '小紋は **お食事会やお出かけ** にぴったりのカジュアルな着物です。🍵\n\nおしゃれな普段着として楽しめる、素敵な小紋を取り揃えております。',
    category: '商品'
  },
  {
    keywords: ['紬', 'つむぎ'],
    answer: '紬は **カジュアルなお出かけ** に最適な、味わい深い着物です。✨\n\n手織りならではの風合いを楽しめる、厳選の紬をご用意しております。',
    category: '商品'
  },
  {
    keywords: ['浴衣', 'ゆかた'],
    answer: '浴衣は **お祭りや花火大会** はもちろん、夏のお出かけにぴったりです。🎆\n\nお手頃な価格からお選びいただけます。帯や下駄のコーディネートもご相談ください。',
    category: '商品'
  },
  {
    keywords: ['七五三', 'しちごさん', '子供', 'こども', 'お子様'],
    answer: '七五三おめでとうございます！🎉\n\nお子様の晴れ姿を彩る、可愛らしい着物をご用意しております。\n**3歳・5歳・7歳** それぞれのサイズと柄を取り揃えております。レンタルも可能です。',
    category: '商品'
  },
  {
    keywords: ['小物', 'アクセサリー', '帯締め', '帯揚げ', '草履', 'ぞうり', '下駄', 'バッグ', '髪飾り'],
    answer: '和装小物も豊富にご用意しております。🎀\n\n• 帯締め・帯揚げ\n• 草履・下駄\n• バッグ・クラッチ\n• 髪飾り\n• 半衿・重ね衿\n\nコーディネートのご相談もお気軽にどうぞ。',
    category: '商品'
  },

  // レンタル
  {
    keywords: ['レンタル', '貸衣装', '借りる', 'かりる'],
    answer: '着物レンタルを承っております。👘\n\n• **振袖レンタル**: 成人式や結納に\n• **留袖レンタル**: 結婚式のご親族に\n• **訪問着レンタル**: 各種フォーマルに\n\n小物一式セットでのレンタルも可能です。\nご予算やご用途に合わせてご提案いたします。',
    category: 'レンタル'
  },
  {
    keywords: ['料金', '値段', '価格', 'いくら', '費用', '予算'],
    answer: 'お着物の種類やプランによって異なりますので、お気軽にお問い合わせください。💰\n\n📞 **06-6692-2239**\n\nご予算に合わせたご提案もいたしますので、お気軽にご相談ください。',
    category: 'レンタル'
  },
  {
    keywords: ['予約', '予約方法', '申し込み', '来店予約'],
    answer: 'ご来店のご予約は **お電話** にて承っております。📞\n\n**06-6692-2239**\n\nご来店時にゆっくりとお着物をお選びいただけるよう、事前のご予約をおすすめしております。',
    category: 'レンタル'
  },

  // サービス
  {
    keywords: ['着付け', 'きつけ', '着る', '着方'],
    answer: '着付けサービスも承っております。💁‍♀️\n\n経験豊富なスタッフが丁寧にお着付けいたします。\n成人式やお宮参りなど、特別な日に安心してお任せください。\n\nまた、YouTubeチャンネルでは **着付けの解説動画** も公開中です！🎬',
    category: 'サービス'
  },
  {
    keywords: ['お手入れ', 'クリーニング', 'しみ', 'シミ', '汚れ', '洗い', 'メンテナンス'],
    answer: 'お着物のお手入れのご相談も承っております。✨\n\n• シミ抜き\n• 丸洗い\n• プレス（アイロン）\n• 防虫・防カビ対策\n\n大切なお着物を長くお召しいただけるよう、プロの技術でお手入れいたします。',
    category: 'サービス'
  },
  {
    keywords: ['仕立て', '仕立て直し', 'サイズ直し', 'リフォーム', '寸法'],
    answer: 'お着物の仕立て・仕立て直しも承っております。🪡\n\n• 新規仕立て\n• サイズ直し（裄丈・身丈の調整）\n• 裏地の交換\n\nお母様やおばあ様のお着物を受け継ぐお手伝いもいたします。',
    category: 'サービス'
  },
  {
    keywords: ['YouTube', 'ユーチューブ', '動画', 'チャンネル'],
    answer: 'YouTubeチャンネルを開設しております！🎬\n\n着物の着付け方や帯の結び方など、分かりやすい動画を公開中です。\n初めての方にもおすすめですので、ぜひご覧ください。📱',
    category: 'サービス'
  },

  // イベント
  {
    keywords: ['成人式', 'せいじんしき', '二十歳', 'はたち', '20歳'],
    answer: '成人式おめでとうございます！🎊\n\n当店では振袖の **ご購入・レンタル** の両方をご用意しております。\n\n• 前撮り撮影のご相談\n• 当日の着付け\n• ヘアメイクのご紹介\n\nお早めのご来店をおすすめしております。',
    category: 'イベント'
  },
  {
    keywords: ['結婚式', 'ウェディング', '婚礼', '披露宴'],
    answer: 'ご結婚おめでとうございます！💒\n\n• **新郎新婦のお母様**: 黒留袖\n• **ご親族**: 色留袖・訪問着\n• **ゲスト**: 訪問着・付下げ\n\nお立場に合わせたお着物をご提案いたします。レンタルも承っております。',
    category: 'イベント'
  },
  {
    keywords: ['卒業式', 'そつぎょう', '卒業', '袴', 'はかま'],
    answer: 'ご卒業おめでとうございます！🎓\n\n卒業式にふさわしい **袴スタイル** のコーディネートもご相談いただけます。\n着物と袴の組み合わせで、素敵な卒業式をお迎えください。',
    category: 'イベント'
  },
  {
    keywords: ['お宮参り', 'みやまいり', '初着', 'うぶぎ', '産着'],
    answer: 'お宮参りおめでとうございます！👶\n\nお子様の初着（産着）をご用意しております。\n男の子・女の子それぞれ、おめでたい柄のお着物を取り揃えております。\nレンタルも承っておりますので、お気軽にどうぞ。',
    category: 'イベント'
  },

  // その他
  {
    keywords: ['支払い', '支払方法', 'カード', 'クレジット', 'キャッシュレス', 'paypay', 'ペイペイ'],
    answer: 'お支払い方法につきましては、店頭にてご確認ください。💳\n\nお電話でも事前にお問い合わせいただけます。\n📞 **06-6692-2239**',
    category: 'その他'
  },
  {
    keywords: ['ギフト', 'プレゼント', '贈り物', 'お祝い'],
    answer: 'お着物や和装小物のギフトもおすすめです。🎁\n\n• 風呂敷\n• 扇子\n• 和装小物セット\n\nお祝いやお返しにいかがでしょうか。のし紙のご対応も承ります。',
    category: 'その他'
  },
  {
    keywords: ['ブログ', 'blog', '情報', 'お知らせ'],
    answer: '当店のブログでは、最新のお知らせやコーディネート情報を発信しております。📝\n\n着物の豆知識やお手入れのコツなど、お役立ち情報も満載です。\nぜひチェックしてみてください。',
    category: 'その他'
  }
];

// ─── クイックアクション定義 ───
const QUICK_ACTIONS = [
  { label: '📍 アクセス', text: 'お店の場所を教えてください' },
  { label: '🕐 営業時間', text: '営業時間を教えてください' },
  { label: '👘 振袖', text: '振袖について教えてください' },
  { label: '📦 レンタル', text: 'レンタルについて教えてください' },
  { label: '✨ お手入れ', text: '着物のお手入れについて教えてください' },
  { label: '📞 電話番号', text: '電話番号を教えてください' }
];

// ─── ウェルカムメッセージ ───
const WELCOME_MESSAGE = 'いらっしゃいませ！\nだるまや呉服店へようこそ。🎎\n\nお着物に関するご質問やお問い合わせは、お気軽にどうぞ。\n下のボタンからもお選びいただけます。';

// ─── 不明時の応答 ───
const FALLBACK_RESPONSES = [
  '申し訳ございません、そちらについてはお電話でお問い合わせいただけますと幸いです。📞\n\n**06-6692-2239**\n（営業時間 10:00～19:00）',
  'お手数ですが、詳しくはお電話にてお問い合わせくださいませ。📞\n\n**06-6692-2239**\n\n専門のスタッフが丁寧にご対応いたします。',
  'そちらのご質問については、お電話にて詳しくご案内させていただきます。📞\n\n**06-6692-2239**\n\nどうぞお気軽にお電話ください。'
];

// ─── DOM要素 ───
const chatToggle = document.getElementById('chatToggle');
const chatToggleIcon = document.getElementById('chatToggleIcon');
const chatBadge = document.getElementById('chatBadge');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const quickActionsEl = document.getElementById('quickActions');

let isOpen = false;
let isFirstOpen = true;

// ─── 初期化 ───
function init() {
  renderQuickActions();
  setupEventListeners();
}

// ─── イベントリスナー ───
function setupEventListeners() {
  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', closeChat);

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// ─── チャットの開閉 ───
function toggleChat() {
  if (isOpen) {
    closeChat();
  } else {
    openChat();
  }
}

function openChat() {
  isOpen = true;
  chatWindow.classList.add('open');
  chatToggle.classList.add('active');

  // アイコン切り替え
  chatToggleIcon.querySelector('.icon-chat').style.display = 'none';
  chatToggleIcon.querySelector('.icon-close').style.display = 'block';

  // バッジ非表示
  chatBadge.classList.add('hidden');

  // 初回オープン時のみウェルカムメッセージ
  if (isFirstOpen) {
    isFirstOpen = false;
    setTimeout(() => {
      addBotMessage(WELCOME_MESSAGE);
    }, 500);
  }

  // 入力にフォーカス
  setTimeout(() => chatInput.focus(), 400);
}

function closeChat() {
  isOpen = false;
  chatWindow.classList.remove('open');
  chatToggle.classList.remove('active');

  // アイコン切り替え
  chatToggleIcon.querySelector('.icon-chat').style.display = 'block';
  chatToggleIcon.querySelector('.icon-close').style.display = 'none';
}

// ─── メッセージ送信 ───
function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  chatInput.value = '';

  // タイピングインジケーター表示
  showTypingIndicator();

  // 応答を遅延させてリアルな感じに
  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    hideTypingIndicator();
    const response = getResponse(text);
    addBotMessage(response);
  }, delay);
}

// ─── メッセージ追加 ───
function addBotMessage(text) {
  const messageEl = createMessageElement('bot', text);
  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

function addUserMessage(text) {
  const messageEl = createMessageElement('user', text);
  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

function createMessageElement(type, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${type}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = type === 'bot' ? '🎎' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = formatMessage(text);

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = getCurrentTime();

  bubble.appendChild(time);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);

  return wrapper;
}

function formatMessage(text) {
  // **太字** の変換
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // 改行の変換
  text = text.replace(/\n/g, '<br>');
  // リスト項目
  text = text.replace(/• /g, '<span style="color: var(--color-gold);">•</span> ');
  return text;
}

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// ─── タイピングインジケーター ───
function showTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'message bot';
  wrapper.id = 'typingMessage';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🎎';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';

  bubble.appendChild(indicator);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);

  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function hideTypingIndicator() {
  const typing = document.getElementById('typingMessage');
  if (typing) typing.remove();
}

// ─── スクロール ───
function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 50);
}

// ─── クイックアクション ───
function renderQuickActions() {
  QUICK_ACTIONS.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'quick-action-btn';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      addUserMessage(action.text);
      showTypingIndicator();
      const delay = 800 + Math.random() * 700;
      setTimeout(() => {
        hideTypingIndicator();
        const response = getResponse(action.text);
        addBotMessage(response);
      }, delay);
    });
    quickActionsEl.appendChild(btn);
  });
}

// ─── 応答ロジック ───
function getResponse(input) {
  // 助詞を除去しない軽い正規化（挨拶・感謝の判定用）
  const lightNormalized = input.toLowerCase()
    .replace(/[？！。、「」『』【】（）\s]/g, '');

  // 挨拶への対応（助詞除去前にチェック）
  const greetings = ['こんにちは', 'こんばんは', 'おはよう', 'はじめまして', 'ども', 'やぁ', 'hello', 'hi'];
  for (const greeting of greetings) {
    if (lightNormalized.includes(greeting)) {
      return 'いらっしゃいませ！🎎\nだるまや呉服店でございます。\n\nお着物のご相談、お気軽にどうぞ。\n何かお手伝いできることはございますか？';
    }
  }

  // 感謝への対応（助詞除去前にチェック）
  const thanks = ['ありがとう', 'ありがと', 'サンキュー', 'thanks', '助かり'];
  for (const thank of thanks) {
    if (lightNormalized.includes(thank)) {
      return 'こちらこそ、ありがとうございます。😊\n\n他にもご質問がございましたら、お気軽にお声がけください。\nご来店を心よりお待ちしております。🎎';
    }
  }

  // FAQ検索用の深い正規化（助詞を除去）
  const normalizedInput = lightNormalized
    .replace(/を|は|が|の|に|で|と|も|や|か|へ|から|まで|より|ね|よ|な/g, '');

  let bestMatch = null;
  let bestScore = 0;

  for (const faq of FAQ_DATABASE) {
    let score = 0;
    for (const keyword of faq.keywords) {
      const normalizedKeyword = keyword.toLowerCase()
        .replace(/[？！。、「」『』【】（）\s]/g, '');
      if (normalizedInput.includes(normalizedKeyword)) {
        // キーワードが長いほど高スコア
        score += normalizedKeyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  // フォールバック
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[randomIndex];
}

// ─── 起動 ───
init();
