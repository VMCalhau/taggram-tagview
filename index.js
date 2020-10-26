(function(apiUrl) {
  var uuid = null;
  var user_logged = null;

  function getMe() {
    return fetch(apiUrl + "/me")
      .then(function(response) {
        return response.json();
      })
      .then(function(user) {
        const $username = document.getElementById("current-user-username");
        const $avatar = document.getElementById("current-user-avatar");

        $username.innerHTML = user.username;
        user_logged = user.username;

        if (user.avatar) {
          $avatar.style.backgroundImage = "url('" + user.avatar + "')";
        }
      });
  }

  function getPost() {
    return fetch(apiUrl + "/post")
      .then(function(response) {
        return response.json();
      })
      .then(function(post) {
        const months = ['janeiro','fevereiro','março','abril','maio','junho',
                        'julho','agosto','setembro','outubro','novembro','dezembro'];
        uuid = post.uuid;
        const $photo = document.getElementById("photo");

        const $author_name = document.getElementById("author-name");
        const $author_avatar = document.getElementById("author-avatar");
        const $author_location = document.getElementById("author-location");

        const $comments_number = document.getElementById("comments-number");
        const $post_date = document.getElementById("post-date");

        const $comments = document.getElementById("comments");

        $photo.style.backgroundImage = "url('" + post.photo + "')";
        $author_name.innerHTML = post.user.username;
        $author_location.innerHTML = post.location.city + ", " + post.location.country;

        if (post.user.avatar) {
          $author_avatar.style.backgroundImage = "url('" + post.user.avatar + "')";
        }

        $comments_number.innerHTML = post.comments.length + " comentários";
        $post_date.innerHTML = post.created_at.substring(8,10) + " de " + 
                               months[post.created_at.substring(5,7)-1];

        for (var i = 0; i < post.comments.length; i++) {
          $comments.innerHTML += "<div class='comment'>" +
                                "<div class='comment-author'>" + post.comments[i].user.username.bold() + 
                                " " + post.comments[i].message +"</div>" +
                                "<div class='comment-date'>" + 
                                (new Date().getHours() - new Date(post.comments[i].created_at).getHours()) +"h</div>" + 
                                "<div class='comment-avatar' id='comment-avatar" + i + "'></div>" +
                                "</div>";
          if (post.comments[i].user.avatar) {
            document.getElementById("comment-avatar" + i).style.
                    backgroundImage = "url('" + post.comments[i].user.avatar + "')";
          }
        }

        document.getElementById("button").addEventListener('click', postComment);

      });
  }

  function postComment() {
    if (document.getElementById("text").value == "") {
      window.alert("Digite algo para comentar");
      return null;
    }

    const data = {
      'username': user_logged,
      'message': document.getElementById("text").value 
    }

    return fetch(apiUrl + "/posts/" + uuid + "/comments", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

    }).then(function(response) {
        if (response.status == 500) {
          window.alert("Comentário não foi enviado, tente novamente");
          return null;
        }
        else if (response.status == 404) {
          window.alert("Publicação não encontrada");
          return null;
        }
        else if (response.status == 400) {
          window.alert("Usuário inválido");
          return null;
        }

        return response.json();
    })
    .then(function(comments) {
      if (comments != null) {
        const new_comment = comments.length-1;
        document.getElementById("comments").innerHTML += "<div class='comment'>" +
                                  "<div class='comment-author'>" + comments[new_comment].user.username.bold() + 
                                  " " + comments[new_comment].message +"</div>" +
                                  "<div class='comment-date'>" + 
                                  (new Date().getHours() - new Date(comments[new_comment].created_at).getHours()) +"h</div>" + 
                                  "<div class='comment-avatar' id='comment-avatar" + new_comment + "'></div>" +
                                  "</div>";
        if (comments[new_comment].user.avatar) {
          document.getElementById("comment-avatar" + new_comment).style.
                  backgroundImage = "url('" + comments[new_comment].user.avatar + "')";
        }
        document.getElementById("text").value = "";
      }
    })
  }

  function initialize() {
    getMe();
    getPost();
  }

  initialize();
})("https://taggram.herokuapp.com");
