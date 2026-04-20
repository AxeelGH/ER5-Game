export default class Physics{
      constructor(vx = 0, vy = 0, vLimit = 0, omega = 0, angle = 0, xRotCenter = 0, yRotCenter = 0) {
        
        this.vx = 0; // Horizontal velocity (m/s)
        this.vy = 0; // Vertical velocity (m/s)
        this.vLimit = vLimit; // Velocity max limit (m/s)
        this.omega = omega;
        this.angle = angle;
        this.xRotCenter = xRotCenter;
        this.yRotCenter = yRotCenter;
        
        
    }
}