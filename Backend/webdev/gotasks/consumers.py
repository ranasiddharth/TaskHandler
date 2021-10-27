# gotasks/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from . import models
from .serializers import CommentSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # print(text_data)
        card= text_data_json['card']
        message = text_data_json['message']
        commentor = int(self.scope['user'].id)
        data={
            'commentor': commentor,
            'card': card,
            'body':message
        }
        # print(data)
        serializer_data= await self.save_comment(data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': data['body'],
                'data': serializer_data
            }
        )

    @database_sync_to_async
    def save_comment(self, data):
        commentor = models.User.objects.get(id=data['commentor'])
        # print(commentor)
        card= models.Cards.objects.get(id=data['card'])  
        # print(card)

        body= models.Comment.objects.create(commentor=commentor, card=card, body=data['body'])

        CommentSerializer_data= CommentSerializer(body)
        print(CommentSerializer_data.data)

        return CommentSerializer_data.data

    async def update_comment(self, event):
        print("update comment happened")
        comment = event['message']
        await self.send(text_data=json.dumps({
            'info': 'updated',
            'message': comment
        }))

    async def delete_comment(self, event):
        print("delete comment happened")
        comment = event['message']
        print(comment)
        await self.send(text_data=json.dumps({
            'info': 'deleted',
            'message': comment
        }))

    # Receive message from room group
    async def chat_message(self, event):
        data=event["data"]
        # print(event)
        # print(data)
        message = event['message']
        # print(message)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'info' : 'created',
            'message': data
        }))