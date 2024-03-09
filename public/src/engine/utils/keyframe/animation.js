import AnimationPlayer from "./animation_player.js";

/**
 * Class representing an animation.
 */
class Animation {
    /**
     * Create an Animation.
     * @param {object} mRenderable - The renderable object associated with this animation.
     */
    constructor(mRenderable) {
      // Initialize animation properties
      this.mRenderable = mRenderable;
      this.firstFrame = null;
      this.lastFrame = null;
      this.player = new AnimationPlayer(this.mRenderable);
    }
  
    /**
     * Add a frame to the animation.
     * @param {object} mRenderable - The renderable object for the frame.
     * @param {number} [index=null] - The index of the frame (in seconds).
     * @returns {boolean} - True if the frame is added successfully, false otherwise.
     */
    addFrame(mRenderable, index = null) {
      // Check if renderable is null
      if (mRenderable === null) return false;
  
      let timeIndex = index * 60;
      // Create a new frame
      let newFrame = new Frame(mRenderable, timeIndex);
      
      // Handle cases for adding frames
      if (this.isEmpty()) {
        if (index === null) newFrame.frameIndex = 0;
        this.firstFrame = newFrame;
        this.lastFrame = newFrame;
        return true;
      }
      
      
      //if user add frame without index, the default will be add frame with index right after the last frame
      if (index === null) {
        timeIndex = this.lastFrame.frameIndex + 60;
      }
      
      let prevFrame = this.getFrameBeforeIndex(timeIndex);
  
      //safeguard for adding frame with used index on the same animation
      if (prevFrame.next !== null && timeIndex === prevFrame.next.frameIndex) return false;
  
      newFrame.next = prevFrame.next;
      prevFrame.next = newFrame;   
      this.lastFrame = newFrame;
      return true;
    }
  
    /**
     * Get the first frame of the animation.
     * @returns {object|null} - The first frame of the animation, or null if animation is empty.
     */
    getFirstFrame() { return this.firstFrame; }
  
    /**
     * Check if the animation is empty.
     * @returns {boolean} - True if the animation is empty, false otherwise.
     */
    isEmpty() { return this.firstFrame === null; }
  
    /**
     * Delete a frame from the animation.
     * @param {number} [index=null] - The index of the frame to delete (in seconds).
     * @returns {boolean} - True if the frame is deleted successfully, false otherwise.
     */
    deleteFrame(index = null) {
      if (this.isEmpty()) return false;
  
      if (index === null) index = this.lastFrame.frameIndex;
      else index * 60;
      
      let prevFrame = this.getFrameBeforeIndex(index * 60);
      prevFrame.next = prevFrame.next.next;
      return true;
    }
    
    /**
     * Reset the entire animation.
     * @returns {boolean} - True if the animation is fully reset.
     */
    reset() {
      if (this.isEmpty()) return false;
      this.firstFrame = null;
      this.lastFrame = null;
      return true;
    }
  
    /**
     * Get the frame before a given index.
     * @param {number} index - The index of the frame (in seconds).
     * @returns {object} - The frame before the given index.
     */
    getFrameBeforeIndex(index) {
      let currFrame = this.firstFrame;
      let prevFrame = currFrame;
  
      while (currFrame !== null) {
        if (currFrame.frameIndex >= index) break;
        prevFrame = currFrame;
        currFrame = currFrame.next;
      }
  
      return prevFrame;
    }
  
    pauseAnimation() {
      this.player.pause();
    }
  
    playAnimation() {
      this.player.start(this);
    }
  }
  
  /**
   * Class representing a frame.
   */
  class Frame {
    /**
     * Create a Frame.
     * @param {object} mRenderable - The renderable object associated with this frame.
     * @param {number} index - The index of the frame (in seconds).
     */
    constructor(mRenderable, index) {
      // Initialize frame properties
      this._width = mRenderable.getXform().getWidth();
      this._height = mRenderable.getXform().getWidth();
      this._XPos = mRenderable.getXform().getXPos();
      this._YPos = mRenderable.getXform().getYPos();
      this._rotationInDegree = mRenderable.getXform().getRotationInDegree();
      this._color = mRenderable.getColor();
  
      this.frameIndex = index;
      this.next = null;
    }
  
    /**
     * Get the X position of the frame.
     * @returns {number} - The X position of the frame.
     */
    getXPos() { return this._XPos; }
  
    /**
     * Get the Y position of the frame.
     * @returns {number} - The Y position of the frame.
     */
    getYPos() { return this._YPos; }
  
    /**
     * Get the width of the frame.
     * @returns {number} - The width of the frame.
     */
    getWidth() { return this._width; }
  
    /**
     * Get the height of the frame.
     * @returns {number} - The height of the frame.
     */
    getHeight() { return this._height; }
  
    /**
     * Get the rotation in degree of the frame.
     * @returns {number} - The rotation in degree of the frame.
     */
    getRotationInDegree() { return this._rotationInDegree; }
  
    /**
     * Get the color of the frame.
     * @returns {array} - The color of the frame.
     */
    getColor() { return this._color; }
  }
  
  export default Animation;
  