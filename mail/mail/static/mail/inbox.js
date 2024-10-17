document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  load_mailbox('inbox');
    
});  
  
function read(id) {

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-view').innerHTML = `
      <h3 class = "sender"> From: ${email.sender} </h3>
      <h3 class = "subject"> Subject: ${email.subject} </h3>
      <p class = "timestamp2"> ${email.timestamp} </p>
      <hr>
      <p class = "body"> ${email.body}
    `;  

    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
      
  });
}

function archive(id, archive){

  console.log(archive);
  
  if(archive === true){
    archive = false;
  }
  else{
    archive = true
  }


  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive
    })
  })
  
  load_mailbox((archive === true) ? 'inbox' : 'archive');

}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function addEmail(email) {

  //Create a new email
  const mail = document.createElement('div');
  if(email.read)
    mail.classList.add("email", "read");
  else
    mail.classList.add("email", "unread");
  mail.innerHTML = `
   <h4 class = "sender"> Sender: ${email.sender} </h4>
   <h3 class = "subject"> Subject: ${email.subject} </h3>
   <div class = "timestamp"> ${email.timestamp} </div>
  `;
  //Add necessary buttons (Read, Archive)
  const read_btn = document.createElement('button');
  read_btn.innerHTML = "read";
  read_btn.classList.add("btn", "btn-sm", "btn-outline-primary", "btn-read");
  read_btn.id = "read";
  read_btn.style.margin = "5px";

  const archive_btn = document.createElement('button');
  if(email.archived){
    archive_btn.innerHTML = "Unarchive";
  }
  else {
    archive_btn.innerHTML = "Archive";
  }
  archive_btn.id = "archive";
  archive_btn.style.margin = "5px";
  archive_btn.classList.add("btn", "btn-sm", "btn-outline-primary");

  mail.appendChild(archive_btn);
  mail.appendChild(read_btn);
  //Add eventListener to the buttons
  read_btn.addEventListener('click', () => {read(email.id)});
  archive_btn.addEventListener('click', () => {archive(email.id, email.archived)});
  //Add created mail to emails view
  document.querySelector('#emails-view').append(mail);
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show the emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      emails.forEach(addEmail);
  }); 
  
}