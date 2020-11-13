// Class for "walls" of track
class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(0);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

// Class for raycasting
class Ray {
  constructor(pos, angle) {
    this.pos = createVector(pos.x, pos.y);
    this.dir = p5.Vector.fromAngle(radians(angle));
  }

  setDirection(angle) {
    this.dir = p5.Vector.fromAngle(radians(angle));
  }

  pointTo(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  // Returns the point
  castPoint(b) {
    const den =
      (b.a.x - b.b.x) * (this.pos.y - (this.pos.y + this.dir.y)) -
      (b.a.y - b.b.y) * (this.pos.x - (this.pos.x + this.dir.x));

    if (den == 0) return false;

    const t =
      ((b.a.x - this.pos.x) * (this.pos.y - (this.pos.y + this.dir.y)) -
        (b.a.y - this.pos.y) * (this.pos.x - (this.pos.x + this.dir.x))) /
      den;
    const u =
      -((b.a.x - b.b.x) * (b.a.y - this.pos.y) - (b.a.y - b.b.y) * (b.a.x - this.pos.x)) /
      den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = b.a.x + t * (b.b.x - b.a.x);
      pt.y = b.a.y + t * (b.b.y - b.a.y);
      return pt;
    } else {
      return false;
    }
  }
}
