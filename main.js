// Small helpers for all pages
(function(){
  // set current year in footers
  function setYears(){
    var els = document.querySelectorAll('[id^="year"]');
    var y = new Date().getFullYear();
    els.forEach(function(el){ el.textContent = y; });
  }
  setYears();

  // Mobile nav toggles
  var toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(function(btn){
    btn.addEventListener('click', function(){
      // find the next nav sibling or match by id pattern
      var nav = this.parentElement.querySelector('.site-nav');
      if(!nav){
        var id = this.id.replace('nav-toggle','site-nav');
        nav = document.getElementById(id);
      }
      if(nav){ nav.classList.toggle('show'); }
    });
  });

  // Contact form basic validation & faux-submit
  var form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = document.getElementById('form-status');
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var msg = document.getElementById('message');
      if(!name.value.trim() || !email.value.trim() || !msg.value.trim()){
        status.textContent = 'Please fill out all fields.';
        status.style.color = 'crimson';
        return;
      }
      // basic email pattern
      var re = /\S+@\S+\.\S+/;
      if(!re.test(email.value)){
        status.textContent = 'Please provide a valid email address.';
        status.style.color = 'crimson';
        return;
      }
      // Simulate success (no backend in starter site)
      status.textContent = 'Thanks — your message looks good. Please email .email@example.com to submit.';
      status.style.color = 'green';
      form.reset();
    });
  }

  // Image upload preview + optional POST
  var imageInput = document.getElementById('image-input');
  var imagePreview = document.getElementById('image-preview');
  var imagePreviewWrap = document.getElementById('image-preview-wrap');
  var imageForm = document.getElementById('image-upload-form');
  var imageStatus = document.getElementById('image-upload-status');

  if(imageInput){
    imageInput.addEventListener('change', function(e){
      var file = e.target.files && e.target.files[0];
      if(!file){
        if(imagePreviewWrap) imagePreviewWrap.style.display = 'none';
        if(imagePreview) imagePreview.src = '';
        return;
      }
      // preview
      var url = URL.createObjectURL(file);
      if(imagePreview){
        imagePreview.src = url;
        imagePreviewWrap.style.display = 'block';
        imagePreview.onload = function(){ URL.revokeObjectURL(url); };
      }
      if(imageStatus) imageStatus.textContent = '';
    });
  }

  if(imageForm){
    imageForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!imageInput || !imageInput.files || !imageInput.files[0]){
        if(imageStatus){ imageStatus.textContent = 'Please choose an image first.'; imageStatus.style.color = 'crimson'; }
        return;
      }
      // Try to POST to /upload if available
      var file = imageInput.files[0];
      var fd = new FormData();
      fd.append('image', file);

      if(imageStatus){ imageStatus.textContent = 'Uploading...'; imageStatus.style.color = 'black'; }

      fetch('/upload', { method: 'POST', body: fd })
        .then(function(res){
          if(!res.ok) throw new Error('No upload endpoint available');
          return res.json();
        })
        .then(function(data){
          if(imageStatus){ imageStatus.textContent = 'Upload successful.'; imageStatus.style.color = 'green'; }
        })
        .catch(function(err){
          // Most users won't have a server — explain local-only preview
          if(imageStatus){ imageStatus.textContent = 'Preview saved locally only. No upload endpoint found.'; imageStatus.style.color = '#666'; }
        });
    });
  }
})();