import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

 let allTweets = tweetsData

document.addEventListener('click', function(e){
    if (e.target.dataset.like) {
      handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
      handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
      handleReplyClick(e.target.dataset.reply);
    } else if (e.target.id === "tweet-btn") {
      handleTweetBtnClick();
    } else if (e.target.dataset.replybtn) {
      replyTweetBtn(e.target.dataset.replybtn);
    } else if(e.target.dataset.deletebtn) {
        deleteTweetBtn(e.target.dataset.deletebtn)
    } else if(e.target.dataset.deletereplybtn) {
        deleteReplyBtn(e.target.deletereplybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = allTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = allTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        allTweets.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

    

}

function replyTweetBtn(ID) {
  const replyInput = document.getElementById(`reply-input-${ID}`);
  const replyBtn = document.querySelector(`#reply-btn-${ID}`);
  let replyObj = {
    handle: `@Scrimba`,
    profilePic: `images/scrimbalogo.png`,
    tweetText: replyInput.value,
  };

  const targetObj = allTweets.filter(function (tweet) {
    return tweet.uuid === ID;
  })[0];

  targetObj.replies.unshift(replyObj);
  render();

  handleReplyClick(ID);
}

function deleteTweetBtn(tweetID) {
   
    allTweets = allTweets.filter(function(tweet) {
        return tweet.uuid !== tweetID
    })
    render()
}

function deleteReplyBtn(tweetID) {
        allTweets.forEach(function(tweets) {
            tweets.replies = tweets.replies.filter(function(tweet) {
                return tweet.uuid !== tweetID
            })
        })
        render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    allTweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
                <button id="delete-reply-btn-${tweet.uuid}" class="delete-btn" data-deletereplybtn="${tweet.uuid}">Delete</button>
            </div>
        </div>
</div>
`;
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                 </span>
                  <span class="tweet-detail">
                   <i class="fa-regular fa-trash-can" 
                   data-deletebtn="${tweet.uuid}"></i>
                
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
    <textarea placeholder="What's happening?" id="reply-input-${tweet.uuid}" class="reply-input"></textarea>
    <button id="reply-btn-${tweet.uuid}" class="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
    
        ${repliesHtml}
    </div>   
</div>
`;
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

