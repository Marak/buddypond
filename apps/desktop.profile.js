desktop.profile = {};

desktop.profile.load = function loadDesktop() {
  $('.updateProfileButton').on('click', function(){
    let updates = {};
    updates.email = $('.buddy_email').val();
    updates.password = $('.buddy_password').val();
    updates.confirmPassword = $('.confirm_buddy_password').val();
    
    if (!updates.password && !updates.confirmPassword) {
      // email update only
    }
    
    buddypond.updateBuddyProfile({ updates: { email: updates.email }}, function(err, res){
      console.log(err, res)
    })
    
    console.log(updates)
  })
  
  $( "#tabs" ).tabs();

};

