(() => {
  'use strict';
  const launcher = document.getElementById('consultation-launcher');
  const dialog = document.getElementById('consultation-dialog');
  const overlay = document.getElementById('consultation-overlay');
  if (!launcher || !dialog || !overlay) return;
  const transcript = document.getElementById('consultation-transcript');
  const choices = document.getElementById('consultation-choices');
  const closeButton = document.getElementById('consultation-close');
  const restartButton = document.getElementById('consultation-restart');
  let selection = null;
  let previousFocus = null;
  let initialized = false;
  let background = [];
  const topics = {
    rental: { label: '着物をレンタルしたい', service: '着物のレンタル', prompt: 'どのような機会に着物をご利用になりますか？', details: ['成人式', '結婚式・お祝いの席', 'その他・まだ決まっていない'], answer: 'ご利用の機会や日程、ご希望をお聞かせください。レンタルできる着物や料金は、店主が確認してご案内します。' },
    care: { label: 'お手入れ・仕立て直しを相談したい', service: 'お手入れ・仕立て直し', prompt: '気になることをお選びください。', details: ['シミ・汚れ', 'サイズ直し', 'その他のお手入れ'], answer: '着物の状態を確認して、対応方法やお見積もりをご案内します。写真を添えたい場合は、LINE・InstagramのDMをご利用ください。' },
    goods: { label: '着物・和装小物を探している', service: '着物・和装小物のお探し', prompt: 'お探しのものをお選びください。', details: ['着物', '帯', '和装小物'], answer: 'お探しの品やご希望をお聞かせください。在庫やご用意できる商品は、店主が確認してご案内します。' },
    previous: { label: '以前の依頼について聞きたい', service: 'これまでのご依頼について', answer: 'これまでお願いしていただいたことも、お気軽にご相談ください。ご依頼内容や時期など、わかる範囲でお知らせください。' }
  };
  const addMessage = (text, from = 'bot') => {
    const item = document.createElement('p');
    item.className = `consultation-message consultation-${from}`;
    item.textContent = text;
    transcript.append(item);
    // Keep a short readable conversation, without saving it elsewhere.
    while (transcript.children.length > 18) transcript.firstElementChild.remove();
    transcript.scrollTop = transcript.scrollHeight;
  };
  const button = (label, action) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = label;
    item.addEventListener('click', action);
    return item;
  };
  const link = (label, href) => {
    const item = document.createElement('a');
    item.textContent = label;
    item.href = href;
    if (href.startsWith('https://')) { item.target = '_blank'; item.rel = 'noopener noreferrer'; }
    return item;
  };
  const showChoices = items => {
    choices.replaceChildren(...items);
    choices.firstElementChild?.focus({ preventScroll: true });
    requestAnimationFrame(() => { transcript.scrollTop = transcript.scrollHeight; });
  };
  const close = (restoreFocus = true) => {
    overlay.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('consultation-open');
    background.forEach(([element, wasInert]) => { element.inert = wasInert; });
    background = [];
    if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  };
  const handoff = () => {
    const service = document.getElementById('booking-service');
    const message = document.getElementById('booking-message');
    const note = document.getElementById('booking-chat-note');
    let explanation = 'ご希望の日時と連絡先を入力して、お申し込みください。';
    if (selection && service && message) {
      const summary = `[ご相談案内] ${selection.service}${selection.detail ? '：' + selection.detail : ''}`;
      if (!service.value) {
        service.value = selection.service;
        service.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (service.value !== selection.service) {
        explanation = '入力済みのご相談内容はそのままにしています。今回選んだ内容もご確認のうえ、お申し込みください。';
      }
      if (!message.value.split('\n').includes(summary)) {
        const next = message.value ? message.value + '\n' + summary : summary;
        if (next.length <= message.maxLength) {
          message.value = next;
          message.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          explanation = '詳細欄の文字数上限のため、自動追記できませんでした。内容を整理して、今回のご相談を追記してください。';
        }
      }
      note.textContent = `${selection.service}${selection.detail ? '（' + selection.detail + '）' : ''}を選択しました。${explanation}`;
    } else {
      note.textContent = explanation;
    }
    note.hidden = false;
    close(false);
    const section = document.getElementById('reservation');
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    note.focus({ preventScroll: true });
  };
  const showContacts = () => {
    showChoices([
      button('HPから相談・予約する ↓', handoff),
      link('電話：070-9282-9237', 'tel:07092829237'),
      link('LINEで相談・予約 ↗', 'https://lin.ee/Po4pNId'),
      link('InstagramのDMで相談・予約 ↗', 'https://www.instagram.com/netkimono/')
    ]);
  };
  const showTopic = key => {
    const topic = topics[key];
    addMessage(topic.label, 'user');
    selection = { service: topic.service, detail: '' };
    if (!topic.details) {
      addMessage(topic.answer);
      showContacts();
      return;
    }
    addMessage(topic.prompt);
    showChoices(topic.details.map(detail => button(detail, () => {
      selection.detail = detail;
      addMessage(detail, 'user');
      addMessage(topic.answer);
      showContacts();
    })));
  };
  const showInfo = () => {
    selection = null;
    addMessage('予約方法・場所を知りたい', 'user');
    addMessage('知りたいことをお選びください。');
    const info = [
      ['予約方法', 'HPの予約フォーム・電話・LINE・InstagramのDMから、お名前・ご相談内容・ご希望の日時をお知らせください。日時と場所を調整し、だるまやからの確認のご連絡をもって予約確定となります。'],
      ['場所・営業について', 'ご相談場所は大阪市東住吉区駒川5-8-11です。2026年10月からは予約制で承っています。ご訪問の前に必ずご連絡ください。'],
      ['料金・見積もりについて', '料金や対応できる範囲は、ご相談内容や着物の状態を確認して店主がご案内します。まずはご希望をお聞かせください。']
    ];
    showChoices(info.map(([label, answer]) => button(label, () => {
      addMessage(label, 'user');
      addMessage(answer);
      showContacts();
      if (label === '場所・営業について') choices.append(link('地図を開く ↗', 'https://www.google.com/maps/search/?api=1&query=大阪市東住吉区駒川5-8-11'));
    })));
  };
  const showHome = () => {
    selection = null;
    transcript.replaceChildren();
    addMessage('こんにちは、だるまやのご相談案内です。どのようなことでお困りですか？');
    showChoices([...Object.keys(topics).map(key => button(topics[key].label, () => showTopic(key))), button('予約方法・場所を知りたい', showInfo)]);
  };
  launcher.hidden = false;
  launcher.addEventListener('click', () => {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('consultation-open');
    background = [...document.body.children].filter(element => element !== overlay && element.tagName !== 'SCRIPT').map(element => [element, element.inert]);
    background.forEach(([element]) => { element.inert = true; });
    if (!initialized) { showHome(); initialized = true; }
    closeButton.focus({ preventScroll: true });
  });
  closeButton.addEventListener('click', () => close());
  restartButton.addEventListener('click', showHome);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.getElementById('reservation-form')?.addEventListener('reset', () => {
    const note = document.getElementById('booking-chat-note');
    note.hidden = true;
    note.textContent = '';
  });
})();
