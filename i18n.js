// 翻译文本
const translations = {
  'zh-CN': {
    appName: '暗中观察',
    addAccount: '添加账号',
    addAccountTitle: '添加账号',
    inputPlaceholder: '请输入社交媒体账号链接',
    cancel: '取消',
    confirm: '确认添加',
    moreActions: '更多操作',
    delete: '删除',
    language: '语言',
    parseError: '无法解析该链接，请确保输入了正确的社交媒体账号链接'
  },
  'en-US': {
    appName: 'PeekPeek',
    addAccount: 'Add Account',
    addAccountTitle: 'Add Account',
    inputPlaceholder: 'Enter social media account link',
    cancel: 'Cancel',
    confirm: 'Confirm',
    moreActions: 'More Actions',
    delete: 'Delete',
    language: 'Language',
    parseError: 'Unable to parse the link. Please make sure you entered a valid social media account link'
  }
};

// 当前语言
let currentLanguage = localStorage.getItem('language') || 'zh-CN';

// i18n 工具对象
const i18n = {
  // 设置语言
  setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.updatePageText();
  },

  // 获取翻译文本
  t(key) {
    return translations[currentLanguage]?.[key] || translations['zh-CN'][key] || key;
  },

  // 更新页面文本
  updatePageText() {
    // 更新标题
    document.title = this.t('appName');
    document.querySelector('.header h1').textContent = this.t('appName');

    // 更新添加按钮
    document.querySelector('#addButton').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      ${this.t('addAccount')}
    `;

    // 更新模态框
    document.querySelector('.modal-content h2').textContent = this.t('addAccountTitle');
    document.querySelector('#accountUrl').placeholder = this.t('inputPlaceholder');
    document.querySelector('#cancelAdd').textContent = this.t('cancel');
    document.querySelector('.confirm-button').textContent = this.t('confirm');

    // 重新渲染账号列表以更新删除按钮文本
    if (typeof renderAccounts === 'function') {
      renderAccounts();
    }
  }
};

// 导出 i18n 对象
window.i18n = i18n;

// 初始化页面文本
document.addEventListener('DOMContentLoaded', () => {
  i18n.updatePageText();
});