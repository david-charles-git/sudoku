aws_ecr_push () {
  ecr_id="811111"
  ecr_region="eu-west-1"
  ecr_uri="$ecr_id.dkr.ecr.$ecr_region.amazonaws.com"
  image_name="sudoku:latest"
  echo "Logging into AWS ECR"
  aws ecr get-login-password --region "$ecr_region" | docker login --username AWS --password-stdin "$ecr_uri"
  echo "Pushing image to AWS ECR"
  docker tag sudoku:latest "$ecr_id/$image_name"
  docker push "$ecr_id/$image_name"
  echo "Pushed image to AWS ECR"
}

aws_ecr_push