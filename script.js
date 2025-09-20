let selectedMood = '';
let posts = [];
let nextPostId = 1;

const moodEmojis = {
    'senang': '\u{1F600}',
    'sedih': '\u{1F622}',
    'marah': '\u{1F621}',
    'stress': '\u{1F62B}',
    'kecewa': '\u{1F61E}'
};

document.addEventListener('DOMContentLoaded', function () {
    initializeMoodSelector();
    initializeForm();
    initializeSamplePosts();
    renderPosts();
});

function initializeMoodSelector() {
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.mood-option').forEach(opt =>
                opt.classList.remove('selected')
            );
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
            document.querySelector('.form-container').classList.remove('hidden');
            document.getElementById('authorName').focus();
        });
    });
}

function initializeForm() {
    document.getElementById('storyForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!selectedMood) {
            alert('Silakan pilih mood kamu dulu!');
            return;
        }

        const authorName = document.getElementById('authorName').value.trim();
        const storyText = document.getElementById('storyText').value.trim();
        if (!authorName || !storyText) {
            alert('Mohon isi semua field!');
            return;
        }

        createNewPost(authorName, storyText);
        resetForm();
        alert('Cerita berhasil dibagikan!');
    });
}

function createNewPost(authorName, storyText) {
    const post = {
        id: nextPostId++,
        mood: selectedMood,
        author: authorName,
        content: storyText,
        likes: 0,
        liked: false,
        comments: [],
        timestamp: new Date().toISOString()
    };
    posts.push(post);
    renderPosts();
}

function initializeSamplePosts() {
    if (posts.length > 0) return;
    posts = [
        {
            id: nextPostId++,
            mood: 'senang',
            author: 'Ayu',
            content: 'Hari ini aku merasa sangat bersyukur.',
            likes: 2,
            liked: false,
            comments: [{ author: 'Rina', text: 'Ikut senang baca ini!' }],
            timestamp: new Date().toISOString()
        }
    ];
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = posts.map(post => `
    <div class="post">
      <div class="post-header">
        <div>
          <span class="post-mood">${getMoodEmoji(post.mood)}</span>
          <span class="post-author">${escapeHtml(post.author)}</span>
        </div>
      </div>
      <div class="post-content">${escapeHtml(post.content)}</div>
      
      <div class="post-actions">
        <button class="action-btn" onclick="likePost(${post.id})">
          <img src="icons/like.png" alt="Like"> <span>${post.likes || 0}</span>
        </button>
        <button class="action-btn" onclick="toggleCommentForm(${post.id})">
          <img src="icons/comment.png" alt="Comment"> <span>Komentar</span>
        </button>
        <button class="action-btn delete-btn" onclick="deletePost(${post.id})">
          <img src="icons/delete.png" alt="Delete"> <span>Hapus</span>
        </button>
      </div>
      
      <div class="comment-section" id="comment-section-${post.id}" style="display:none;">
        <div class="comment-list">
          ${(post.comments || []).map(c => `<div class="comment"><strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}</div>`).join('')}
        </div>
        <form onsubmit="addComment(event, ${post.id})" class="comment-form">
          <input type="text" name="author" placeholder="Nama kamu" required>
          <textarea name="text" placeholder="Tulis komentar..." required></textarea>
          <button type="submit">Kirim</button>
        </form>
      </div>
    </div>
  `).join('');
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderPosts();
    }
}

function deletePost(postId) {
    posts = posts.filter(p => p.id !== postId);
    renderPosts();
}

function toggleCommentForm(postId) {
    const section = document.getElementById(`comment-section-${postId}`);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function addComment(e, postId) {
    e.preventDefault();
    const form = e.target;
    const author = form.querySelector('input[name="author"]').value.trim();
    const text = form.querySelector('textarea[name="text"]').value.trim(); // <-- ganti ke textarea

    if (author && text) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({ author, text });
            renderPosts();
            form.reset();
        }
    }
}

function getMoodEmoji(mood) { return moodEmojis[mood] || '📝'; }
function formatDate(iso) { return new Date(iso).toLocaleString('id-ID'); }
function resetForm() { document.getElementById('storyForm').reset(); selectedMood = ''; document.querySelector('.form-container').classList.add('hidden'); document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected')); }
function escapeHtml(str) { return str.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[m])); }
