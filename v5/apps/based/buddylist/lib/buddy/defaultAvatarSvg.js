export default function defaultAvatarSvg(username) {
  // Check if avatar is already cached
  if (this.data.avatarCache.has(username)) {
    return this.data.avatarCache.get(username);
  }

  // Create an identicon avatar using DiceBear
  const avatar = this.bp.vendor.dicebear.createAvatar(this.bp.vendor.dicebearAvatars, {
    seed: username, // Username as seed for consistent avatar
    size: 40, // Avatar size in pixels
    backgroundColor: ["#f0f0f0"], // Optional: Customize background
  });

  // Convert avatar to SVG string
  const svg = avatar.toString();

  // Store in cache
  this.data.avatarCache.set(username, svg);

  return svg;
}