export function getRandomEmoji(type: 'happy' | 'sad') {
  const randomWonEmoji = ['🥳', '🎉', '👏'];
  const randomLostEmoji = [
    '😨',
    '😕',
    '😓',
    '😣',
    '😞',
    '😩',
    '😧',
    '😰',
    '😖',
    '😮',
    '😫',
    '🙁',
    '😢',
    '😥',
    '😟',
    '😔',
    '😭',
    '😿',
  ];

  if (type == 'happy') {
    return randomWonEmoji[Math.floor(randomWonEmoji.length * Math.random())];
  } else {
    return randomLostEmoji[Math.floor(randomLostEmoji.length * Math.random())];
  }
}
