$(document).ready(function () {

    // On the datepickers update the second date so that it cannot be before the
    // selected start date
    function checkStartDate(firstDate, secondDate) {

        $(firstDate).datepicker({
            dateFormat: "mm/dd/yy",
            onClose: function (firstDate) {
                $(secondDate).datepicker("option", "minDate", firstDate), $(this).valid();
            }
        })
    }

    function checkEndDate(firstDate, secondDate) {

        $(secondDate).datepicker({
            dateFormat: "mm/dd/yy",
            onClose: function (secondDate) {
                $(firstDate).datepicker("option", "maxDate", secondDate), $(this).valid()
            }
        })
    }

    // Make a pretty phone mask with jquery
    $("#phone").mask("(999) 999-9999", {
        placeholder: "x"
    });

    // Do the math! 
    var calcTotals = function (inputDate) {
        var t = inputDate.split("/"),
            date = new Date(t[2], t[0] - 1, t[1]);
        return date;
    },
        // A simple way to calculate the number of days between two dates
        daysDiff = function (firstDate, secondDate) {
            return Math.floor((secondDate - firstDate) / 864e5)
        },
        // Get the total cost of the base price by multiplying the number of days * the cost
        calcTotalRoom = function () {
            var numDays = daysDiff(calcTotals($("#date_from").val()), calcTotals($("#date_to").val())),
                roomCost = 0,
                roomTotal = 0;
            return roomCost = $("#calculator .calculate_room option:selected").attr("data-price"), roomCost = Math.round(100 * parseFloat(roomCost)) / 100, roomTotal = Math.round(numDays * roomCost * 100) / 100, isNaN(roomTotal) ? 0 : roomTotal;
        },
         // Get the total cost of the extras by adding up all the extras and then multiplying it * number of days
        calcTotalExtras = function () {
            var numDays = daysDiff(calcTotals($("#date_from").val()), calcTotals($("#date_to").val())),
                extras = $('#calculator .calculate_extras input[type="checkbox"]'),
                myTotal = 0;
            // Calculate the total of the extras by lookping through each checked item
            return extras.each(function () {
                this.checked && $.each(this.attributes, function () {
                    "data-price" === this.name && (myTotal += parseFloat(this.value));
                })
            }), myTotal = Math.round(numDays * myTotal * 100) / 100, isNaN(myTotal) ? 0 : myTotal;
        },
        calcTotalCost = function () {
            return (calcTotalRoom() + calcTotalExtras());
        };

    // Add up all the totals and remove the hidden field - cool
    $(".calculate_date, .calculate_room, .calculate_extras").change(function () {
        $("#total-price").removeClass("hidden"), $("#span_total_room").html(" $" + calcTotalRoom()), $("#span_total_extras").html(" $" + calcTotalExtras()), $("#span_totals").html(" $" + calcTotalCost()), $("#input_total_room").val(calcTotalRoom()), $("#input_total_extras").val(calcTotalExtras()), $("#input_totals").val(calcTotalCost())
    }), checkStartDate("#date_from", "#date_to"), checkEndDate("#date_from", "#date_to"), $("#calculator").validate({
        errorClass: "error-view",
        validClass: "success-view",
        errorElement: "span",
        onkeyup: !1,
        onclick: !1,
        ignore: "",
        rules: {
            date_from: {
                required: !0
            },
            date_to: {
                required: !0
            },
            room_type: {
                required: !0
            },
            name: {
                required: !0
            },
            email: {
                required: !0,
                email: !0
            }
        },
        messages: {
            date_from: {
                required: "Please select check-in date"
            },
            date_to: {
                required: "Please select check-out date"
            },
            room_type: {
                required: "Please select a room type"
            },
            name: {
                required: "Please enter your name"
            },
            email: {
                required: "Please enter your email",
                email: "Incorrect email format"
            },
            phone: {
                required: "Please enter your phone"
            }
        },
        // Go to the next box and hightlight it when you are filling in the form
        highlight: function (e, t, a) {
            $(e).closest(".input").removeClass(a).addClass(t), ($(e).is(":checkbox") || $(e).is(":radio")) && $(e).closest(".check").removeClass(a).addClass(t)
        },
        unhighlight: function (e, t, a) {
            $(e).closest(".input").removeClass(t).addClass(a), ($(e).is(":checkbox") || $(e).is(":radio")) && $(e).closest(".check").removeClass(t).addClass(a)
        },
        errorPlacement: function (e, t) {
            $(t).is(":checkbox") || $(t).is(":radio") ? $(t).closest(".check").append(e) : $(t).closest(".unit").append(e)
        }
    })
});