document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            // Fetch user data
            return fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
                    return response.json();
                })
                .then(users => {
                    // Map user data for quick lookup
                    const userMap = {};
                    users.forEach(user => {
                        userMap[user.id] = user;
                    });

                    // Render posts with user information
                    const postsContainer = document.getElementById('posts-container');
                    postsContainer.innerHTML = '';
                    posts.forEach(post => {
                        const user = userMap[post.userId];
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        postElement.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.body}</p>
                            <p><strong>Name:</strong> ${user.name} </p>
                            <p><strong>Email:</strong>${user.email}</p>
                            <div class="comments-container" style="display: none;"></div>
                        `;
                        postElement.addEventListener('click', () => {
                            toggleComments(postElement, post.id);
                        });
                        postsContainer.appendChild(postElement);
                    });
                });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function toggleComments(postElement, postId) {
    const commentsContainer = postElement.querySelector('.comments-container');

    if (commentsContainer.style.display === 'none') {
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(comments => {
                commentsContainer.innerHTML = '';
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `
                        <h3>${comment.name}</h3>

                        <p><strong>Email:</strong> ${comment.email}</p>
                        <p>${comment.body}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
                commentsContainer.style.display = 'block';
            })
            .catch(error => console.error('Error fetching comments:', error));
    } else {
        commentsContainer.style.display = 'none';
    }
}
