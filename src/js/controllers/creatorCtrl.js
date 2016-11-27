app.controller('CreatorCtrl', ['$scope', function ($scope) {
	$scope.takePicture = function () {
	 	html2canvas(document.getElementById("creator"), {
            useCORS: true,
            onrendered: function (canvas) {
                var img = canvas.toDataURL("image/png");
                console.log(img)
                var link = document.createElement('a');
                link.href = img;
                link.download = 'SapegatoCOM.jpg';
                document.body.appendChild(link);
                link.click();
            }
        });

	}
}])