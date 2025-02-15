// 从 localStorage 获取保存的账号列表
let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

// DOM 元素
const addButton = document.getElementById('addButton');
const addAccountModal = document.getElementById('addAccountModal');
const addAccountForm = document.getElementById('addAccountForm');
const cancelAddButton = document.getElementById('cancelAdd');
const accountsList = document.getElementById('accountsList');

// 显示添加账号模态框
addButton.addEventListener('click', () => {
  addAccountModal.classList.add('show');
  addAccountForm.accountUrl.focus();
});

// 隐藏添加账号模态框
cancelAddButton.addEventListener('click', () => {
  addAccountModal.classList.remove('show');
  addAccountForm.reset();
});

// 解析社交媒体账号链接
async function parseUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) return null;
    
    let username = '';
    
    // 根据不同平台处理用户 ID
    if (hostname.includes('okjike.com') && pathParts.includes('users')) {
      const userIndex = pathParts.indexOf('users') + 1;
      if (userIndex < pathParts.length) {
        username = pathParts[userIndex];
      }
    } else if (hostname.includes('weibo.com') && pathParts.includes('u')) {
      const userIndex = pathParts.indexOf('u') + 1;
      if (userIndex < pathParts.length) {
        username = pathParts[userIndex];
      }
    } else {
      // 默认使用路径的最后一个部分作为用户名
      username = pathParts[pathParts.length - 1];
    }
    
    if (!username) return null;
    let platform = '';
    let avatar = '';
    
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      platform = 'Twitter';
      avatar = `https://unavatar.io/twitter/${username}`;
      try {
        const response = await fetch(`https://unavatar.io/twitter/${username}/json`);
        const data = await response.json();
        if (data.name) {
          username = data.name;
        }
      } catch {
        // 如果获取昵称失败，保持使用原始用户名
      }
    } else if (hostname.includes('instagram.com')) {
      platform = 'Instagram';
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
    } else if (hostname.includes('facebook.com')) {
      platform = 'Facebook';
      avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
    } else if (hostname.includes('linkedin.com')) {
      platform = 'LinkedIn';
    } else if (hostname.includes('github.com')) {
      platform = 'GitHub';
      avatar = `https://unavatar.io/github/${username}`;
    } else if (hostname.includes('dribbble.com')) {
      platform = 'Dribbble';
      avatar = `https://unavatar.io/dribbble/${username}`;
    } else if (hostname.includes('onlyfans.com')) {
      platform = 'OnlyFans';
      avatar = `https://unavatar.io/onlyfans/${username}`;
    } else if (hostname.includes('substack.com')) {
      platform = 'Substack';
      avatar = `https://unavatar.io/substack/${username}`;
    } else if (hostname.includes('t.me')) {
      platform = 'Telegram';
      avatar = `https://unavatar.io/telegram/${username}`;
    } else if (hostname.includes('twitch.tv')) {
      platform = 'Twitch';
      avatar = `https://unavatar.io/twitch/${username}`;
    } else if (hostname.includes('youtube.com')) {
      platform = 'YouTube';
      avatar = `https://unavatar.io/youtube/${username}`;
    } else {
      platform = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    }
    
    return { platform, username, avatar };
  } catch {
    return null;
  }
}

// 添加新账号
addAccountForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = addAccountForm.accountUrl.value;
  
  const parsedInfo = await parseUrl(url);
  if (!parsedInfo) {
    alert('无法解析该链接，请确保输入了正确的社交媒体账号链接');
    return;
  }
  
  const newAccount = {
    id: crypto.randomUUID(),
    platform: parsedInfo.platform,
    username: parsedInfo.username,
    url: url,
    avatar: parsedInfo.avatar
  };
  
  accounts.push(newAccount);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  
  addAccountForm.reset();
  addAccountModal.classList.remove('show');
  renderAccounts();
});

// 删除账号
function handleDeleteAccount(id) {
  accounts = accounts.filter(account => account.id !== id);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  renderAccounts();
}

// 渲染账号列表
function renderAccounts() {
  accountsList.innerHTML = accounts.slice().reverse().map(account => `
    <div class="account-card" onclick="window.open('${account.url}', '_blank', 'noopener,noreferrer')">
      <div class="account-info">
        <div class="account-avatar-container">
          <img
            src="${account.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${account.username}`}"
            alt="${account.platform} avatar"
            class="account-avatar"
          />
          <img
            src="https://unavatar.io/${new URL(account.url).hostname}"
            alt="${account.platform} icon"
            class="platform-icon"
          />
        </div>
        <div class="account-details">
          <h3>${account.username}</h3>
          <p>${new URL(account.url).hostname.replace('www.', '')}</p>
        </div>
      </div>
      <div class="account-actions" onclick="event.stopPropagation()">
        <div class="more-actions">
          <button 
            class="more-button" 
            title="更多操作"
            onclick="toggleDropdown('${account.id}')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <div class="dropdown-menu" data-dropdown-id="${account.id}">
            <button 
              class="delete-button"
              onclick="handleDeleteAccount('${account.id}')"
              title="删除账号"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// 切换下拉菜单
function toggleDropdown(id) {
  const dropdowns = document.querySelectorAll('.dropdown-menu');
  dropdowns.forEach(dropdown => {
    if (dropdown.dataset.dropdownId === id) {
      dropdown.classList.toggle('show');
    } else {
      dropdown.classList.remove('show');
    }
  });
}

// 点击页面其他地方关闭下拉菜单
document.addEventListener('click', (event) => {
  if (!event.target.closest('.more-actions')) {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
  }
});

// 点击模态框外部关闭模态框
addAccountModal.addEventListener('click', (event) => {
  if (event.target === addAccountModal) {
    addAccountModal.classList.remove('show');
    addAccountForm.reset();
  }
});

// 初始渲染账号列表
renderAccounts();