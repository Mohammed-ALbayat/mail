document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  document.querySelectorAll('#read').forEach((button) => {
    console.log(button);
    // button.addEventListener('click', read(button));
  });
  
  // document.querySelectorAll('#archive').forEach((button) => {
  //   addEventListener('click', archive(button));
  // });
  // By default, load the inbox
  load_mailbox('inbox');
});

function read(button) {
  fetch(`/emails/${button.dataset.id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      
      const sender = document.createElement('div');
      sender.innerHTML = `From: ${email.sender}`;
      const recipients = document.createElement('div');
      recipients.innerHTML = `TO + ${email.recipients}`;
      const subject = document.createElement('div');
      subject.innerHTML = email.subject;
      const timestamp = document.createElement('div');
      timestamp.innerHTML = email.timestamp;
      const body = document.createElement('div');
      body.innerHTML = email.body;

      document.querySelector('#email-view').append(sender);

      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';
      
  });

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
  const mail = document.createElement('div');
  if(email.read)
    mail.classList.add("email", "read");
  else
    mail.classList.add("email", "unread");
  const sender = document.createElement('div');
  sender.className = "sender";
  sender.innerHTML = email.sender;
  const timestamp = document.createElement('div');
  timestamp.className = "timestamp";
  timestamp.innerHTML = email.timestamp;
  const subject = document.createElement('div');
  subject.className = "subject";
  subject.innerHTML = email.subject;
  const read = document.createElement('button');
  read.innerHTML = "read";
  read.dataset.id = email.id;
  read.classList.add("btn", "btn-sm", "btn-outline-primary", "btn-read");
  read.id = "read";
  read.style.margin = "5px";
  const archive = document.createElement('button');
  archive.innerHTML = "archive";
  archive.id = "archive";
  archive.style.margin = "5px";
  archive.classList.add("btn", "btn-sm", "btn-outline-primary");
  archive.dataset.id = email.id;
  mail.appendChild(sender);
  mail.appendChild(timestamp);
  mail.appendChild(subject);
  mail.appendChild(archive);
  mail.appendChild(read);

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