
export default function showContextMenu(x, y, buddyName) {
    const $menu = $('<div>', {
      id: 'customContextMenu',
      css: {
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 99999,
        display: 'block',
        background: 'white',
        border: '1px solid #ccc',
        padding: '10px',
        cursor: 'pointer'
      }
    }).append($('<ul>').append(
      $('<li>').text('View Profile').on('click', () => openProfile(buddyName))
    ));
  
    function openProfile(buddyName) {
      console.log('Opening profile for ' + buddyName);
      if (bp.admin) {
        bp.open('admin-profile', { context: buddyName });
      } else {
        bp.open('user-profile', { context: buddyName });
      }
    }
  
    $('#customContextMenu').remove();
    $('body').append($menu);
  
    $(document).one('click', function () {
      $('#customContextMenu').remove();
    });
  }
  