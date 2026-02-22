#!/bin/bash

echo "🚀 LocalStack 초기화 시작..."

# S3 버킷 생성
echo "📦 S3 버킷 생성 중..."
awslocal s3 mb s3://projectree-local 2>/dev/null || echo "   ℹ️  버킷이 이미 존재합니다"

# 버킷 목록 확인
echo "📋 S3 버킷 목록:"
awslocal s3 ls

echo "✅ LocalStack 초기화 완료!"
