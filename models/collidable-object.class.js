class CollidableObject extends MovableObject {
    
    collidable = true; // Indicates if the object is collidable
    damage = 0; // Damage value of the object
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }; // Offset values for collision detection
}