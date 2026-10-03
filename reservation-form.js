(() => {
  'use strict';
  const form = document.getElementById('reservation-form');
  if (!form) return;
  const status = document.getElementById('booking-status');
  const fallback = document.getElementById('booking-fallback');
  const submit = form.querySelector('button[type="submit"]');
  const flexible = document.getElementById('booking-flexible');
  const date1 = document.getElementById('booking-date1');
  const date2 = document.getElementById('booking-date2');
  const email = document.getElementById('booking-email');
  const phone = document.getElementById('booking-phone');
  const reply = document.getElementById('booking-reply');
  const dateFields = [date1, date2, document.getElementById('booking-time1'), document.getElementById('booking-time2')];
  // Dates are based on the shop's timezone, even for customers overseas.
  const todayInJapan = () => {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const part = type => parts.find(item => item.type === type).value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  };
  const syncDates = () => {
    dateFields.forEach(field => { field.disabled = flexible.checked; });
    date1.required = !flexible.checked;
    form.querySelector('.date-required').hidden = flexible.checked;
    const today = todayInJapan();
    [date1, date2].forEach(field => { field.min = today; });
  };
  const syncReply = () => {
    email.required = reply.value === 'メール';
    const badge = document.getElementById('email-requirement');
    badge.textContent = email.required ? '必須' : '任意';
    badge.className = email.required ? 'required' : 'optional';
    email.setCustomValidity(reply.value === 'メール' && !email.value.trim() ? 'メールでの返信をご希望の場合は、メールアドレスを入力してください。' : '');
  };
  const syncPhone = () => {
    const value = phone.value.normalize('NFKC');
    const digits = value.replace(/\D/g, '');
    const valid = /^[+\d\s()ー−‐–—-]+$/u.test(value) && digits.length >= 10 && digits.length <= 15;
    phone.setCustomValidity(value && !valid ? '電話番号を確認してください。例：090-1234-5678' : '');
  };
  flexible.addEventListener('change', syncDates);
  reply.addEventListener('change', syncReply);
  email.addEventListener('input', syncReply);
  phone.addEventListener('input', syncPhone);
  syncDates();
  syncReply();
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    syncDates();
    syncReply();
    syncPhone();
    if (!form.reportValidity()) return;
    submitting = true;
    submit.disabled = true;
    submit.textContent = '送信しています…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    status.removeAttribute('data-state');
    fallback.hidden = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      if (result.ok !== true) throw new Error('Submission not confirmed');
      form.reset();
      syncDates();
      syncReply();
      syncPhone();
      status.dataset.state = 'success';
      status.textContent = 'ご予約のお申し込みを受け付けました。\n内容を確認し、だるまやからご連絡いたします。\n日時・場所の確認ができましたら、予約確定となります。';
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError'
        ? '送信結果を確認できませんでした。重複したお申し込みを避けるため、お電話・LINE・InstagramのDMで受付状況をご確認ください。'
        : '送信を完了できませんでした。入力内容を確認して再送信するか、お電話・LINE・InstagramのDMからご連絡ください。';
      fallback.hidden = false;
    } finally {
      clearTimeout(timer);
      submitting = false;
      submit.disabled = false;
      submit.textContent = 'この内容で予約を申し込む';
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
