/** 三维坐标 */
export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 场景中一颗可拾取的星星 */
export interface StarItem extends Vec3 {
  id: number
}
