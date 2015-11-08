
	// Smart texture
var image = {
  render: function (ctx, entity, tickTime) {
    var character = entity;

    if (character.currentHealth <= 0) {
      return;
    }


    var offsetX = 0;
    var offsetY = 0;
    var entityWidth = entity.width();
    var entityHeight = entity.height();
    
    var maxHealth = 100;
    var currentHealth = entity.data('health');

    // Drawing the bar background
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(offsetX, offsetY, entityWidth, entityHeight);

    // Drawing the bar itself
    var interval = entityWidth / maxHealth;
    var barWidth = currentHealth * interval;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(offsetX, offsetY, barWidth, entityHeight);

    // Drawing a border around the progress bar
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(offsetX, offsetY, entityWidth, entityHeight);

    // Drawing the health text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(offsetX + (entityWidth / 2), offsetY + (entityHeight / 2));
    ctx.fillStyle = '#000000';
    ctx.fillText(String(currentHealth) + " / " + String(maxHealth), 0, 0);
  }
}