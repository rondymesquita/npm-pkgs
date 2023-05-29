const conventionalRecommendedBump = require(`conventional-recommended-bump`);

conventionalRecommendedBump({
  preset: `conventionalcommits`
}, (error, recommendation) => {
  console.log(recommendation.releaseType); // 'major'
});
