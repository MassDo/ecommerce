from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .products import products 

@api_view(['GET'])
def getRoutes(request):
    routes=[
        'blabla',
        'bloblo'
    ]

    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    return Response(products)

@api_view(['GET'])
def getProduct(request, pk):
    prod = [p for p in products if p['_id'] == pk]

    return Response(prod)
